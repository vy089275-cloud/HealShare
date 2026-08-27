package com.healshare.backend.controller;

import com.healshare.backend.dto.CreateReservationRequest;
import com.healshare.backend.dto.ReservationResponseDto;
import com.healshare.backend.entity.Reservation;
import com.healshare.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // Create a reservation
    @PostMapping
    public Reservation createReservation(@RequestBody CreateReservationRequest request) {
        return reservationService.createReservation(request);
    }

    // Fetch reservations for a customer
    @GetMapping("/customer/{customerId}")
    public List<ReservationResponseDto> getByCustomer(@PathVariable Long customerId) {
        return reservationService.getReservationsForCustomer(customerId);
    }

    // Approve reservation
    @PutMapping("/{reservationId}/approve")
    public Reservation approveReservation(@PathVariable Long reservationId) {
        return reservationService.approveReservation(reservationId);
    }

    // Fetch reservations for a pharmacist
    @GetMapping("/pharmacist/{pharmacistId}")
    public List<ReservationResponseDto> getByPharmacist(@PathVariable Long pharmacistId){
        return reservationService.getReservationsForPharmacist(pharmacistId);
    }

    @PutMapping("/{reservationId}/collected")
    public void collectReservation(@PathVariable Long reservationId) {
        reservationService.collectReservation(reservationId);
    }

}