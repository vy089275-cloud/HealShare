package com.healshare.backend.repository;

import com.healshare.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findAllByOrderByTimestampDesc();

    List<Notification> findByReadStatusFalse();

    // ⭐ Only this pharmacist's notifications
    List<Notification> findByPharmacistIdOrderByTimestampDesc(Long pharmacistId);

    @Query("SELECT p.id FROM Pharmacist p WHERE p.email = :email")
    Long findPharmacistIdByEmail(@Param("email") String email);

    // ⭐ Only unread notifications of this pharmacist
    List<Notification> findByPharmacistIdAndReadStatusFalse(Long pharmacistId);
}
