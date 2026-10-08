package com.healshare.backend.controller;

import com.healshare.backend.entity.Pharmacist;
import com.healshare.backend.repository.PharmacistRepository;
import com.healshare.backend.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/pharmacists")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://healshare.vercel.app"
})
public class PharmacistController {

    @Autowired
    private PharmacistRepository pharmacistRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // ===========================
    // ⭐ Pharmacist Registration
    // ===========================
    @PostMapping("/signup")
    public Map<String, Object> registerPharmacist(
            @RequestPart("pharmacist") Pharmacist pharmacist,
            @RequestPart(value = "photos", required = false) MultipartFile[] photos
    ) throws IOException {

        Map<String, Object> response = new HashMap<>();

        Optional<Pharmacist> existing = pharmacistRepository.findByEmail(pharmacist.getEmail());
        if (existing.isPresent()) {
            response.put("error", "Pharmacist already exists");
            return response;
        }

        List<String> photoUrls = new ArrayList<>();

        if (photos != null && photos.length > 0) {
            if (photos.length > 3) {
                response.put("error", "Maximum 3 photos allowed");
                return response;
            }

            String uploadDir = System.getProperty("user.dir") + File.separator +
                    "uploads" + File.separator + "pharmacists" + File.separator;

            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            for (MultipartFile photo : photos) {
                if (photo.getSize() > 3 * 1024 * 1024) {
                    response.put("error", "File size must be below 3MB");
                    return response;
                }

                // Remove spaces & unsafe characters
                String originalName = Objects.requireNonNull(photo.getOriginalFilename());
                String cleanedName = originalName.replaceAll("\\s+", "_");   // spaces → underscores
                cleanedName = cleanedName.replaceAll("[^a-zA-Z0-9._-]", ""); // remove special chars

                String fileName = UUID.randomUUID() + "_" + cleanedName;

                File dest = new File(uploadDir + fileName);
                photo.transferTo(dest);

                String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
                photoUrls.add(baseUrl + "/uploads/pharmacists/" + fileName);
            }
        }

        pharmacist.setShopPhotoUrls(photoUrls);
        pharmacistRepository.save(pharmacist);

        response.put("message", "Pharmacist registered successfully");
        return response;
    }

    // ===========================
    // ⭐ Pharmacist Login
    // ===========================
    @PostMapping("/login")
    public Map<String, Object> loginPharmacist(@RequestBody Pharmacist pharmacist) {
        Map<String, Object> response = new HashMap<>();

        Optional<Pharmacist> existing = pharmacistRepository.findByEmail(pharmacist.getEmail());
        if (existing.isEmpty()) {
            response.put("error", "Pharmacist does not exist");
            return response;
        }

        Pharmacist saved = existing.get();

        // ⚠ Password check (You should hash it later)
        if (!saved.getPassword().equals(pharmacist.getPassword())) {
            response.put("error", "Invalid password");
            return response;
        }

        String token = jwtUtil.generateToken(saved.getEmail());

        response.put("token", token);
        response.put("message", "Login successful");
        response.put("pharmacist", saved);

        return response;
    }

    // ===========================
    // ⭐ Get own profile
    // ===========================
    @GetMapping("/me")
    public Pharmacist getMyProfile(HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        if (email == null) return null;

        return pharmacistRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Pharmacist not found"));
    }

    // ===========================
    // ⭐ Update profile
    // ===========================
    @PutMapping("/update")
    public Map<String, String> updateProfile(
            HttpServletRequest request,
            @RequestBody Pharmacist updated
    ) {
        Map<String, String> response = new HashMap<>();

        String email = (String) request.getAttribute("email");
        if (email == null) {
            response.put("error", "Unauthorized");
            return response;
        }

        Pharmacist pharmacist = pharmacistRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Pharmacist not found"));

        pharmacist.setPharmacyName(updated.getPharmacyName());

        // ⚠ Prevent changing email because token uses email
        pharmacist.setCity(updated.getCity());
        pharmacist.setPassword(updated.getPassword());
        pharmacist.setLocationLink(updated.getLocationLink());

        // Don't overwrite photos if null
        if (updated.getShopPhotoUrls() != null) {
            pharmacist.setShopPhotoUrls(updated.getShopPhotoUrls());
        }

        pharmacistRepository.save(pharmacist);

        response.put("message", "Profile updated successfully");
        return response;
    }

    // ===========================
    // ⭐ Delete account with photo cleanup
    // ===========================
    @DeleteMapping("/delete")
    public Map<String, String> deleteAccount(HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();

        String email = (String) request.getAttribute("email");
        if (email == null) {
            response.put("error", "Unauthorized");
            return response;
        }

        Optional<Pharmacist> pharmacistOpt = pharmacistRepository.findByEmail(email);
        if (pharmacistOpt.isEmpty()) {
            response.put("error", "Pharmacist not found");
            return response;
        }

        Pharmacist pharmacist = pharmacistOpt.get();

// Delete uploaded photos from server
        if (pharmacist.getShopPhotoUrls() != null) {
            for (String url : pharmacist.getShopPhotoUrls()) {
                try {
                    String fileName = url.substring(url.lastIndexOf("/") + 1);
                    File file = new File(System.getProperty("user.dir") + "/uploads/pharmacists/" + fileName);
                    if (file.exists()) file.delete();
                } catch (Exception e) {
                    e.printStackTrace(); // log error but continue
                }
            }
        }

        pharmacistRepository.delete(pharmacist);
        response.put("message", "Account deleted successfully");

        return response;

    }
}
