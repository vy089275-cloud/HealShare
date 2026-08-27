package com.healshare.backend.repository;

import com.healshare.backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByCustomerId(Long customerId);

    List<Reservation> findByMedicineId(Long medicineId);

    List<Reservation> findByStatus(String status);

    List<Reservation> findByStatusAndApprovedAtBefore(String status, LocalDateTime cutoff);

    List<Reservation> findByMedicineIdAndStatus(Long medicineId, String status);

    // ✅ Needed to fetch all reservations of pharmacist’s medicines
    List<Reservation> findByMedicineIdIn(List<Long> medicineIds);

    long countByMedicineId(Long medicineId);
}