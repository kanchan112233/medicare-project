package com.itvedant.dr215.MedicareApp.controller;

import com.itvedant.dr215.MedicareApp.entity.Doctor;
import com.itvedant.dr215.MedicareApp.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/medicare/doctor")
@CrossOrigin(origins = "http://localhost:5173") // <-- CRITICAL: Allows React/Vite connections
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping("/savedoctor")
    public ResponseEntity<?> saveDoctor(@RequestBody Doctor doctor) {
        return new ResponseEntity<>(doctorService.saveDoctor(doctor), HttpStatus.CREATED);
    }

    @GetMapping("/getAlldoctors")
    public ResponseEntity<?> getAllDoctors() {
        return new ResponseEntity<>(doctorService.getAllDoctors(), HttpStatus.OK);
    }

    @GetMapping("/gerDoctorById/{id}") // Note the typo in your original endpoint name "gerDoctorById"
    public ResponseEntity<?> getDoctorById(@PathVariable Long id) {
        return new ResponseEntity<>(doctorService.getDoctorById(id), HttpStatus.FOUND);
    }

    @GetMapping("/getDoctorBySpec/{spec}")
    public ResponseEntity<?> getDoctorBySpec(@PathVariable String spec) {
        return new ResponseEntity<>(doctorService.getDoctorBySpecialization(spec), HttpStatus.OK);
    }

    @DeleteMapping("/deleteDoctor/{id}")
    public ResponseEntity<?> deleteDoctorById(@PathVariable Long id) {
        return new ResponseEntity<>(doctorService.deleteDoctor(id), HttpStatus.OK);
    }

    @PutMapping("/updateDoctor/{id}")
    public ResponseEntity<?> updateDoctorById(@RequestBody Doctor doctor, @PathVariable Long id) {
        return new ResponseEntity<>(doctorService.updateDoctor(doctor, id), HttpStatus.OK);
    }
}
