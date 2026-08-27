package com.healshare.backend.service;

import com.healshare.backend.dto.CreateReservationRequest;
import com.healshare.backend.dto.ReservationResponseDto;
import com.healshare.backend.entity.Medicine;
import com.healshare.backend.entity.Reservation;
import com.healshare.backend.repository.CustomerRepository;
import com.healshare.backend.repository.MedicineRepository;
import com.healshare.backend.repository.PharmacistRepository;
import com.healshare.backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PharmacistRepository pharmacistRepository;

    // Create a reservation
    public Reservation createReservation(CreateReservationRequest req) {
        Medicine med = medicineRepository.findById(req.getMedicineId())
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        if (req.getQuantity() > med.getQuantity()) {
            throw new RuntimeException("Not enough quantity available");
        }

        med.setQuantity(med.getQuantity() - req.getQuantity());
        medicineRepository.save(med);

        Reservation reservation = new Reservation(
                req.getCustomerId(),
                req.getMedicineId(),
                req.getQuantity()
        );

        return reservationRepository.save(reservation);
    }

    // Convert Reservation to DTO with totalPrice as per frontend logic
    private ReservationResponseDto toDto(Reservation r) {
        ReservationResponseDto dto = new ReservationResponseDto();
        dto.setId(r.getId());
        dto.setQuantity(r.getQuantity());
        dto.setStatus(r.getStatus());
        dto.setReservedAt(r.getReservedAt());
        dto.setApprovedAt(r.getApprovedAt());

        // Fetch medicine
        medicineRepository.findById(r.getMedicineId()).ifPresent(med -> {
            dto.setMedicineName(med.getName());
            dto.setExpiryDate(med.getExpiry() != null ? med.getExpiry().toString() : "Unknown");

            double priceToUse = med.getDiscountedPrice() != null ? med.getDiscountedPrice() : med.getPrice();
            dto.setTotalPrice(priceToUse * r.getQuantity());

            // Fetch pharmacist via pharmacistId
            if (med.getPharmacistId() != null) {
                pharmacistRepository.findById(med.getPharmacistId()).ifPresent(pharma -> {
                    dto.setPharmacyName(pharma.getPharmacyName()); // Corrected
                    dto.setPharmacyCity(pharma.getCity());
                    dto.setPharmacyLocationLink(pharma.getLocationLink());
                    dto.setPharmacyPhotos(pharma.getShopPhotoUrls()); // List of URLs
                });
            }
        });

        // Fetch customer
        customerRepository.findById(r.getCustomerId()).ifPresent(c -> {
            dto.setCustomerName(c.getName());
            dto.setCustomerVillage(c.getVillage());
            dto.setCustomerTaluk(c.getTaluk());
            dto.setCustomerDistrict(c.getDistrict());
        });

        return dto;
    }

    // Fetch reservations for a specific customer
    public List<ReservationResponseDto> getReservationsForCustomer(Long customerId) {
        return reservationRepository.findByCustomerId(customerId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // Fetch reservations for a pharmacist via their medicines
    public List<ReservationResponseDto> getReservationsForPharmacist(Long pharmacistId) {
        List<Medicine> meds = medicineRepository.findByPharmacistId(pharmacistId);
        List<Long> medicineIds = meds.stream().map(Medicine::getId).toList();

        if (medicineIds.isEmpty()) return List.of();

        return reservationRepository.findByMedicineIdIn(medicineIds)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // Approve a reservation
    public Reservation approveReservation(Long reservationId) {
        Reservation r = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        r.setStatus("APPROVED");
        r.setApprovedAt(LocalDateTime.now());
        return reservationRepository.save(r);
    }

    // Mark a reservation as collected and remove it
    public void collectReservation(Long reservationId) {
        Reservation r = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // Delete the reservation
        reservationRepository.delete(r);

        // Check medicine quantity
        medicineRepository.findById(r.getMedicineId()).ifPresent(med -> {
            if (med.getQuantity() == 0) {
                // Delete medicine if quantity is zero
                medicineRepository.delete(med);
            }
            // Otherwise leave it as is
        });
    }

    // Scheduled task: delete approved reservations older than 15 days
    @Scheduled(cron = "0 0 0 * * ?") // daily at midnight
    public void removeExpiredReservations() {
        LocalDateTime expiryThreshold = LocalDateTime.now().minusDays(15);

        reservationRepository.findAll().stream()
                .filter(r -> "APPROVED".equals(r.getStatus()) && r.getApprovedAt() != null)
                .filter(r -> r.getApprovedAt().isBefore(expiryThreshold))
                .forEach(r -> {
                    medicineRepository.findById(r.getMedicineId()).ifPresent(med -> {
                        med.setQuantity(med.getQuantity() + r.getQuantity());
                        medicineRepository.save(med);
                    });
                    reservationRepository.delete(r);
                });
    }
}