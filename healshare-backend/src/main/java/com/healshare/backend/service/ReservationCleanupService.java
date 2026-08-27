package com.healshare.backend.service;

import com.healshare.backend.entity.Reservation;
import com.healshare.backend.repository.MedicineRepository;
import com.healshare.backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationCleanupService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    // Runs every day at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteExpiredApprovedReservations() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(15);
        List<Reservation> expiredReservations =
                reservationRepository.findByStatusAndApprovedAtBefore("APPROVED", cutoff);

        for (Reservation r : expiredReservations) {
            // Restore quantity
            medicineRepository.findById(r.getMedicineId()).ifPresent(med -> {
                med.setQuantity(med.getQuantity() + r.getQuantity());
                medicineRepository.save(med);
            });

            // Delete reservation
            reservationRepository.delete(r);
        }
    }

}