package com.healshare.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String village;
    private String taluk;
    private String district;

    public Customer() {}

    public Customer(String name, String email, String password, String village, String taluk, String district) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.village = village;
        this.taluk = taluk;
        this.district = district;
    }

    // Getters and setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }
    public String getTaluk() { return taluk; }
    public void setTaluk(String taluk) { this.taluk = taluk; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
}