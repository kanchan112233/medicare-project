package com.itvedant.dr215.MedicareApp.controller;

import com.itvedant.dr215.MedicareApp.entity.Patient;
import com.itvedant.dr215.MedicareApp.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.Repository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.itvedant.dr215.MedicareApp.repository.PatientRepository;

import java.security.PrivateKey;
import java.util.List;

// http://localhost:8087/medicare
@RestController
@RequestMapping("/medicare/patient")
public class PatientController
{
    @Autowired
    private PatientService patientService;
   @PostMapping("/savePatient")
    public ResponseEntity<?> savePatient(@RequestBody Patient patient)
    {
        ResponseEntity<?> responseEntity = new ResponseEntity<>(patientService.savePatient(patient),HttpStatus.CREATED);
        return responseEntity;
    }
    @GetMapping("/getAllPatients")
    public ResponseEntity<?> getAllPatients()
    {
        return new ResponseEntity<>(patientService.getAllPatients(),HttpStatus.OK);
    }

    @GetMapping("/getPatientById/{id}")
    public  ResponseEntity<?> getPatientById(@PathVariable Long id){
     return new ResponseEntity<>(patientService.getPatientByID(id),HttpStatus.FOUND);
    }

    @DeleteMapping("/deletePatientById/{id}")
    public ResponseEntity<?> deletePatientById(@PathVariable Long id){
       return new ResponseEntity<>(patientService.deletePatient(id),HttpStatus.OK);
    }

    @PutMapping("/updatePatientById/{id}")
    public ResponseEntity<?> updatePatientById(@RequestBody Patient patient, @PathVariable Long id){
       return new ResponseEntity<>(patientService.updatePatient(patient,id),HttpStatus.OK);
    }
    @GetMapping("/getPatientByBloodgroup/{bgrp}")
    public ResponseEntity<?> getpatientsByBloodgroup(@PathVariable String bgrp){
       return new ResponseEntity<>(patientService.getPatientsByBloodGroup(bgrp),HttpStatus.OK);
    }
}
