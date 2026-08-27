package com.healshare.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ReservationResponseDto {
    private Long id;
    private String medicineName;
    private Integer quantity;
    private Double totalPrice;
    private String status;
    private String customerName;
    private String customerVillage;
    private String customerTaluk;
    private String customerDistrict;
    private LocalDateTime reservedAt;
    private LocalDateTime approvedAt;
    private String expiryDate;

    // Pharmacy details
    private String pharmacyName;
    private String pharmacyCity;
    private String pharmacyLocationLink;
    private List<String> pharmacyPhotos;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerVillage() { return customerVillage; }
    public void setCustomerVillage(String customerVillage) { this.customerVillage = customerVillage; }

    public String getCustomerTaluk() { return customerTaluk; }
    public void setCustomerTaluk(String customerTaluk) { this.customerTaluk = customerTaluk; }

    public String getCustomerDistrict() { return customerDistrict; }
    public void setCustomerDistrict(String customerDistrict) { this.customerDistrict = customerDistrict; }

    public LocalDateTime getReservedAt() { return reservedAt; }
    public void setReservedAt(LocalDateTime reservedAt) { this.reservedAt = reservedAt; }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

    public String getPharmacyName() { return pharmacyName; }
    public void setPharmacyName(String pharmacyName) { this.pharmacyName = pharmacyName; }

    public String getPharmacyCity() { return pharmacyCity; }
    public void setPharmacyCity(String pharmacyCity) { this.pharmacyCity = pharmacyCity; }

    public String getPharmacyLocationLink() { return pharmacyLocationLink; }
    public void setPharmacyLocationLink(String pharmacyLocationLink) { this.pharmacyLocationLink = pharmacyLocationLink; }

    public List<String> getPharmacyPhotos() { return pharmacyPhotos; }
    public void setPharmacyPhotos(List<String> pharmacyPhotos) { this.pharmacyPhotos = pharmacyPhotos; }



}