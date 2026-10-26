package com.itvedant.dr215.MedicareApp.controller;

import com.itvedant.dr215.MedicareApp.entity.LabTest;
import com.itvedant.dr215.MedicareApp.service.LabTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicare/labtest")
@CrossOrigin(origins = "http://localhost:5173") // <-- CRITICAL: Allows React/Vite connections
public class LabTestController {

    @Autowired // <-- CRITICAL: Fixes NullPointerException by injecting your service bean
    private LabTestService labTestService;

    @PostMapping("/saveLabTset")
    public ResponseEntity<LabTest> saveLabTest(@RequestBody LabTest labTest) {
        LabTest saved = labTestService.saveLabTest(labTest);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/all") // Maps to: http://localhost:8087/medicare/labtest/all
    public ResponseEntity<List<LabTest>> getAllLabTests() {
        return new ResponseEntity<>(labTestService.getAllLabTests(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLabTestById(@PathVariable Long id) {
        return new ResponseEntity<>(labTestService.getLabTestById(id), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteLabTest(@PathVariable Long id) {
        return new ResponseEntity<>(labTestService.deleteLabTest(id), HttpStatus.OK);
    }
}
