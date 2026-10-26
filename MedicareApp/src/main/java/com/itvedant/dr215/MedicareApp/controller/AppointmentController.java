package com.itvedant.dr215.MedicareApp.controller;

import com.itvedant.dr215.MedicareApp.entity.Appointment;
import com.itvedant.dr215.MedicareApp.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.lang.model.util.Elements;
import java.util.List;

// http://localhost:8087/medicare
@RestController
@RequestMapping("/medicare/appointment")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentService appointmentService;

    // Constructor injection ensures appointmentService is never null
    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/addAppointment")
    public ResponseEntity<?> saveAppointment(@Valid @RequestBody Appointment appointment) {
        Appointment saved = appointmentService.addAppointment(appointment);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/getAllAppointments")
    public ResponseEntity<?> getAllAppointment() {
        return new ResponseEntity<>(appointmentService.getAllAppointments(), HttpStatus.OK);
    }

    @PutMapping("/confirm/{id}")
    public ResponseEntity<?> confirmAppointment(@PathVariable Long id){
        return new ResponseEntity<>(appointmentService.confirmAppointment(id), HttpStatus.FOUND);
    }

    @PutMapping("/processpay/{id}")
    public ResponseEntity<?> processPayment(@PathVariable Long id,@RequestParam Double payment,
                                            @RequestParam String paymode){
        return new ResponseEntity<>(appointmentService.processPayment(id,payment,paymode),HttpStatus.OK);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAppointmentsByUserId(@PathVariable Long userId) {
        return new ResponseEntity<>(appointmentService.getAppointmentsByUserId(userId),HttpStatus.OK);
    }
}
