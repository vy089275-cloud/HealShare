package com.healshare.backend.repository;

import com.healshare.backend.entity.Pharmacist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PharmacistRepository extends JpaRepository<Pharmacist, Long> {
    Optional<Pharmacist> findByEmail(String email);
}