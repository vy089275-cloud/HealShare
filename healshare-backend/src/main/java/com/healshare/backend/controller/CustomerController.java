package com.healshare.backend.controller;

import com.healshare.backend.entity.Customer;
import com.healshare.backend.repository.CustomerRepository;
import com.healshare.backend.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // ---------------- SIGNUP ----------------
    @PostMapping("/signup")
    public String signup(@RequestBody Customer customer) {
        Optional<Customer> existing = customerRepository.findByEmail(customer.getEmail());

        if (existing.isPresent()) return "Customer already exists";

        customerRepository.save(customer);
        return "Customer registered successfully";
    }

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Customer customer) {
        Map<String, Object> res = new HashMap<>();
        Optional<Customer> existing = customerRepository.findByEmail(customer.getEmail());

        if (existing.isEmpty()) {
            res.put("error", "Customer does not exist");
            return res;
        }

        if (!existing.get().getPassword().equals(customer.getPassword())) {
            res.put("error", "Invalid password");
            return res;
        }

        String token = jwtUtil.generateToken(existing.get().getEmail());

        // ⭐ Send token + customer object (same as pharmacist login)
        res.put("token", token);
        res.put("customer", existing.get());
        res.put("message", "Login successful");

        return res;
    }

    // ---------------- GET PROFILE ----------------
    @GetMapping("/me")
    public Customer getCustomer(HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        if (email == null) return null;
        return customerRepository.findByEmail(email).orElse(null);
    }

    // ---------------- UPDATE PROFILE ----------------
    @PutMapping("/update")
    public String updateCustomer(HttpServletRequest request, @RequestBody Customer updated) {
        String email = (String) request.getAttribute("email");
        if (email == null) return "Unauthorized";

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setName(updated.getName());
        customer.setDistrict(updated.getDistrict());
        customer.setTaluk(updated.getTaluk());
        customer.setVillage(updated.getVillage());
        customer.setPassword(updated.getPassword());

        customerRepository.save(customer);
        return "Profile updated successfully";
    }

    // ---------------- DELETE ACCOUNT ----------------
    @DeleteMapping("/delete")
    public String deleteAccount(HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        if (email == null) return "Unauthorized";

        Optional<Customer> customer = customerRepository.findByEmail(email);
        if (customer.isEmpty()) {
            return "Customer not found";
        }

        customerRepository.delete(customer.get());
        return "Account deleted successfully";
    }
}