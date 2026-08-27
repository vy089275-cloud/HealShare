package com.healshare.backend.controller;

import com.healshare.backend.entity.Notification;
import com.healshare.backend.repository.NotificationRepository;
import com.healshare.backend.repository.PharmacistRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PharmacistRepository pharmacistRepository;

    // ⭐ GET notifications of logged-in pharmacist
    @GetMapping("/my")
    public List<Notification> getMyNotifications(HttpServletRequest request) {

        String role = (String) request.getAttribute("role");
        String email = (String) request.getAttribute("email");

        if (!"PHARMACIST".equals(role)) {
            throw new RuntimeException("Forbidden");
        }

        Long pharmacistId = pharmacistRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Pharmacist not found"))
                .getId();

        return notificationRepository.findByPharmacistIdOrderByTimestampDesc(pharmacistId);
    }

    // ⭐ Mark all notifications as read
    @PutMapping("/mark-all-read")
    public ResponseEntity<String> markAllRead(HttpServletRequest request) {

        String role = (String) request.getAttribute("role");
        String email = (String) request.getAttribute("email");

        if (!"PHARMACIST".equals(role)) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        Long pharmacistId = pharmacistRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Pharmacist not found"))
                .getId();

        List<Notification> unread = notificationRepository
                .findByPharmacistIdAndReadStatusFalse(pharmacistId);

        unread.forEach(n -> n.setReadStatus(true));
        notificationRepository.saveAll(unread);

        return ResponseEntity.ok("All notifications marked as read");
    }

    // ⭐ Delete all notifications
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearAll(HttpServletRequest request) {

        String role = (String) request.getAttribute("role");
        String email = (String) request.getAttribute("email");

        if (!"PHARMACIST".equals(role)) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        Long pharmacistId = pharmacistRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Pharmacist not found"))
                .getId();

        List<Notification> all = notificationRepository
                .findByPharmacistIdOrderByTimestampDesc(pharmacistId);

        notificationRepository.deleteAll(all);

        return ResponseEntity.ok("Notifications cleared");
    }
}
