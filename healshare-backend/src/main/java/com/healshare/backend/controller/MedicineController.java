package com.healshare.backend.controller;

import com.healshare.backend.dto.MedicineWithPharmacist;
import com.healshare.backend.entity.Medicine;
import com.healshare.backend.entity.Notification;
import com.healshare.backend.entity.Pharmacist;
import com.healshare.backend.repository.MedicineRepository;
import com.healshare.backend.repository.NotificationRepository;
import com.healshare.backend.repository.PharmacistRepository;
import com.healshare.backend.repository.ReservationRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/medicines")
@CrossOrigin(origins = "*")
public class MedicineController {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PharmacistRepository pharmacistRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    // ✅ Get all medicines of logged-in pharmacist
    @GetMapping
    public List<Medicine> getMedicines(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        String email = (String) request.getAttribute("email");

        if (!"PHARMACIST".equals(role)) return List.of();

        Long pharmacistId = pharmacistRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Pharmacist not found"))
                .getId();

        LocalDate today = LocalDate.now();

        List<Medicine> meds = medicineRepository.findByPharmacistId(pharmacistId);

        for (Medicine med : meds) {
            long daysLeft = ChronoUnit.DAYS.between(today, med.getExpiry());
            if (daysLeft <= 1) {
                Notification n = new Notification();
                n.setPharmacistId(pharmacistId);
                n.setMessage("Medicine '" + med.getName() + "' (Qty: " + med.getQuantity() +
                        ") deleted automatically as expiry is near.");
                n.setTimestamp(LocalDateTime.now());
                notificationRepository.save(n);

                medicineRepository.deleteById(med.getId());
            }
        }

        // Fetch medicines again after possible deletions
        List<Medicine> remainingMeds = medicineRepository.findByPharmacistId(pharmacistId);

        // ⭐ Sort alphabetically by name
        remainingMeds.sort((m1, m2) -> m1.getName().compareToIgnoreCase(m2.getName()));

        return remainingMeds;
    }

    // ✅ Add medicine for logged-in pharmacist
    @PostMapping
    public Medicine addMedicine(@RequestBody Medicine med, HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        String email = (String) request.getAttribute("email");

        if (!"PHARMACIST".equals(role)) {
            throw new RuntimeException("Forbidden");
        }

        Long pharmacistId = pharmacistRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Pharmacist not found"))
                .getId();

        LocalDate today = LocalDate.now();
        long daysLeft = ChronoUnit.DAYS.between(today, med.getExpiry());
        if (daysLeft <= 1) {
            throw new RuntimeException("Expiry is today or tomorrow. Cannot add this medicine.");
        }

        med.setFree(med.getPrice() == 0);
        med.setPharmacistId(pharmacistId);

        return medicineRepository.save(med);
    }

    // ✅ Update medicine for logged-in pharmacist
    @PutMapping("/{id}")
    public Medicine updateMedicine(@PathVariable Long id, @RequestBody Medicine med, HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        String email = (String) request.getAttribute("email");

        if (!"PHARMACIST".equals(role)) {
            throw new RuntimeException("Forbidden");
        }

        Long pharmacistId = pharmacistRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Pharmacist not found"))
                .getId();

        Medicine existing = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        if (!existing.getPharmacistId().equals(pharmacistId)) {
            throw new RuntimeException("You are not allowed to update this medicine");
        }

        LocalDate today = LocalDate.now();
        long daysLeft = ChronoUnit.DAYS.between(today, med.getExpiry());
        if (daysLeft <= 1) {
            throw new RuntimeException("Expiry is today or tomorrow. Cannot update this medicine.");
        }

        med.setId(id);
        med.setPharmacistId(pharmacistId);
        med.setFree(med.getPrice() == 0);

        return medicineRepository.save(med);
    }

    // ✅ Delete medicine for logged-in pharmacist
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(
            @PathVariable Long id,
            @RequestParam(value = "confirm", required = false, defaultValue = "false") boolean confirm,
            HttpServletRequest request) {

        String role = (String) request.getAttribute("role");
        String email = (String) request.getAttribute("email");

        if (!"PHARMACIST".equals(role)) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        Long pharmacistId = pharmacistRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Pharmacist not found"))
                .getId();

        Medicine med = medicineRepository.findById(id).orElse(null);
        if (med == null) return ResponseEntity.notFound().build();

        if (!med.getPharmacistId().equals(pharmacistId)) {
            return ResponseEntity.status(403).body("You are not allowed to delete this medicine");
        }

        // Count reservations for this medicine
        long reservationsCount = reservationRepository.countByMedicineId(med.getId());
        String warningMessage = "";
        if (reservationsCount > 0) {
            warningMessage = "⚠️ Warning: This medicine has " + reservationsCount +
                    " active reservation(s). Deleting it will remove them.";
        }

        // If not confirmed, return warning (or NO_WARNING for clean delete)
        if (!confirm) {
            if (!warningMessage.isEmpty()) {
                return ResponseEntity.ok(warningMessage);
            } else {
                return ResponseEntity.ok("NO_WARNING");
            }
        }

        // Save notification
        Notification n = new Notification();
        n.setPharmacistId(med.getPharmacistId());
        n.setMessage("Medicine '" + med.getName() + "' (Qty: " + med.getQuantity() + ") deleted manually.");
        n.setTimestamp(LocalDateTime.now());
        notificationRepository.save(n);

        // Delete medicine
        medicineRepository.deleteById(id);

        String responseMessage = "Medicine deleted successfully.";
        if (!warningMessage.isEmpty()) {
            responseMessage += " " + warningMessage;
        }

        return ResponseEntity.ok(responseMessage);
    }
    // ✅ Get ALL medicines for customers (public)
    @GetMapping("/all")
    public List<MedicineWithPharmacist> getAllMedicinesForCustomers() {

        List<Medicine> medicines = medicineRepository.findAll();
        List<MedicineWithPharmacist> result = new ArrayList<>();

        for (Medicine med : medicines) {
            Pharmacist pharmacist = pharmacistRepository.findById(med.getPharmacistId()).orElse(null);
            result.add(new MedicineWithPharmacist(med, pharmacist));
        }

        return result;
    }
}
