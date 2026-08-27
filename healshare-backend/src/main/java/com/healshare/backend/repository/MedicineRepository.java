package com.healshare.backend.repository;

import com.healshare.backend.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    // NEW → fetch medicines belonging to a specific pharmacist
    List<Medicine> findByPharmacistId(Long pharmacistId);
}
