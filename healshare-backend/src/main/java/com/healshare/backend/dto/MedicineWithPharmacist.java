package com.healshare.backend.dto;

import com.healshare.backend.entity.Medicine;
import com.healshare.backend.entity.Pharmacist;

public class MedicineWithPharmacist {
    public Long id;
    public String name;
    public int quantity;
    public Double price;
    public Double discountedPrice;
    public boolean free;
    public String expiry;
    public Pharmacist pharmacist;

    public MedicineWithPharmacist(Medicine med, Pharmacist pharmacist) {
        this.id = med.getId();
        this.name = med.getName();
        this.quantity = med.getQuantity();
        this.price = med.getPrice();
        this.discountedPrice=med.getDiscountedPrice();
        this.free = med.isFree();
        this.expiry = med.getExpiry().toString();
        this.pharmacist = pharmacist;
    }
}