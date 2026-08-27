package com.healshare.backend.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "pharmacist")
public class Pharmacist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pharmacyName;
    private String email;
    private String password;
    private String city;
    private String locationLink;

    @ElementCollection
    @CollectionTable(name = "pharmacist_photos", joinColumns = @JoinColumn(name = "pharmacist_id"))
    @Column(name = "photo_url")
    private List<String> shopPhotoUrls; // ✅ multiple photo URLs

    public Pharmacist() {}

    public Pharmacist(String pharmacyName, String email, String password, String city, String locationLink, List<String> shopPhotoUrls) {
        this.pharmacyName = pharmacyName;
        this.email = email;
        this.password = password;
        this.city = city;
        this.locationLink = locationLink;
        this.shopPhotoUrls = shopPhotoUrls;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getPharmacyName() {
        return pharmacyName;
    }

    public void setPharmacyName(String pharmacyName) {
        this.pharmacyName = pharmacyName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLocationLink() {
        return locationLink;
    }

    public void setLocationLink(String locationLink) {
        this.locationLink = locationLink;
    }

    public List<String> getShopPhotoUrls() {
        return shopPhotoUrls;
    }

    public void setShopPhotoUrls(List<String> shopPhotoUrls) {
        this.shopPhotoUrls = shopPhotoUrls;
    }
}