package com.itvedant.dr215.MedicareApp.controller;

import com.itvedant.dr215.MedicareApp.entity.Medicine;
import com.itvedant.dr215.MedicareApp.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicare/medicine")
@CrossOrigin(origins = "http://localhost:5173")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @PostMapping("/saveMedicine")
    public ResponseEntity<Medicine> saveMedicine(@RequestBody Medicine medicine) {
        Medicine saved = medicineService.saveMedicine(medicine);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/getAllmedicines")
    public ResponseEntity<?> getAllMedicines() {
        return new ResponseEntity<>(medicineService.getAllMedicines(), HttpStatus.OK);
    }

    @PutMapping("/updateMedicine/{id}")
    public ResponseEntity<Medicine> updateMedicine(@RequestBody Medicine medicine, @PathVariable Long id) {
        Medicine updated = medicineService.updateMedicine(medicine, id);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/deleteMedicine/{id}")
    public ResponseEntity<String> deleteMedicine(@PathVariable Long id) {
        String confirmationMessage = medicineService.deleteMedicine(id);
        return new ResponseEntity<>(confirmationMessage, HttpStatus.OK);
    }
}
