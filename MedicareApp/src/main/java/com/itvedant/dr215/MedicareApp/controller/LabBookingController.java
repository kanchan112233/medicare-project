package com.itvedant.dr215.MedicareApp.controller;

import com.itvedant.dr215.MedicareApp.entity.LabBooking;
import com.itvedant.dr215.MedicareApp.service.LabBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicare/lab-booking")
@CrossOrigin(origins = "http://localhost:5173")
public class LabBookingController {

    @Autowired
    private LabBookingService labBookingService;

    // Maps to: POST http://localhost:8087/medicare/lab-booking/addBooking
    @PostMapping("/addBooking")
    public ResponseEntity<?> addBooking(@RequestBody LabBooking booking) {
        LabBooking saved = labBookingService.addBooking(booking);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Maps to: PUT http://localhost:8087/medicare/lab-booking/processpay/{id}
    @PutMapping("/processpay/{id}")
    public ResponseEntity<?> processPayment(
            @PathVariable Long id,
            @RequestParam Double payment,
            @RequestParam String paymode) {
        return new ResponseEntity<>(labBookingService.processPayment(id, payment, paymode), HttpStatus.OK);
    }

    // Maps to: PUT http://localhost:8087/medicare/lab-booking/update-date/{id}
    @PutMapping("/update-date/{id}")
    public ResponseEntity<?> updateAppointmentDate(
            @PathVariable Long id,
            @RequestParam String date) {
        LabBooking updatedBooking = labBookingService.updateBookingDate(id, date);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }

    // Maps to: GET http://localhost:8087/medicare/lab-booking/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBookingsByUserId(@PathVariable Long userId) {
        return new ResponseEntity<>(labBookingService.getBookingsByUserId(userId), HttpStatus.OK);
    }
}
