package com.itvedant.dr215.MedicareApp.controller;

import com.itvedant.dr215.MedicareApp.entity.Medicine;
import com.itvedant.dr215.MedicareApp.entity.Orders;
import com.itvedant.dr215.MedicareApp.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/medicare/api/admin/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminDashboardController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private LabTestRepository labTestRepository;

    @Autowired
    private OrdersRepository orderRepository;

    //  DASHBOARD COUNTS (React: /api/admin/dashboard/counts)
    @GetMapping("/counts")
    public ResponseEntity<Map<String, Long>> getDashboardCounts() {
        Map<String, Long> counts = new HashMap<>();

        counts.put("totalAppointments", appointmentRepository.count());
        counts.put("totalDoctors", doctorRepository.count());
        counts.put("totalMedicines", medicineRepository.count());
        counts.put("totalLabTests", labTestRepository.count());
        counts.put("totalOrders", orderRepository.count());

        return ResponseEntity.ok(counts);
    }

    //  MEDICINES MANAGEMENT (React: /api/admin/dashboard/medicines)
    @GetMapping("/medicines")
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        return ResponseEntity.ok(medicineRepository.findAll());
    }

    @PostMapping("/medicines")
    public ResponseEntity<?> addMedicine(@RequestBody Medicine medicine) {
        if (medicine.getName() == null || medicine.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Medicine name is required.");
        }
        Medicine savedMedicine = medicineRepository.save(medicine);
        return new ResponseEntity<>(savedMedicine, HttpStatus.CREATED);
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long id, @RequestBody Medicine medicineDetails) {
        return medicineRepository.findById(id).map(medicine -> {
            medicine.setName(medicineDetails.getName());
            medicine.setCategory(medicineDetails.getCategory());
            medicine.setPrice(medicineDetails.getPrice());
            medicine.setDescription(medicineDetails.getDescription());
            medicine.setImage(medicineDetails.getImage());

            Medicine updatedMedicine = medicineRepository.save(medicine);
            return ResponseEntity.ok(updatedMedicine);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        return medicineRepository.findById(id).map(medicine -> {
            medicineRepository.delete(medicine);
            return ResponseEntity.ok("Medicine deleted successfully.");
        }).orElse(ResponseEntity.notFound().build());
    }

    //  ORDERS STATUS UPDATE (React: /api/admin/dashboard/orders/{id}/status)
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(status);
            orderRepository.save(order);
            return ResponseEntity.ok("Order status updated successfully.");
        }).orElse(ResponseEntity.notFound().build());
    }
}
