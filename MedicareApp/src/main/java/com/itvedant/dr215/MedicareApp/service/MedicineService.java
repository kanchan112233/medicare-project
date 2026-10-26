package com.itvedant.dr215.MedicareApp.service;

import com.itvedant.dr215.MedicareApp.entity.Medicine;
import com.itvedant.dr215.MedicareApp.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    public Medicine saveMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    // ⚡ NEW: Update an existing medicine record inside the database
    public Medicine updateMedicine(Medicine updatedMedicine, Long id) {
        return medicineRepository.findById(id).map(existingMedicine -> {
            existingMedicine.setName(updatedMedicine.getName());
            existingMedicine.setCategory(updatedMedicine.getCategory());
            existingMedicine.setPrice(updatedMedicine.getPrice());
            existingMedicine.setDescription(updatedMedicine.getDescription());
            existingMedicine.setImage(updatedMedicine.getImage());
            return medicineRepository.save(existingMedicine);
        }).orElseThrow(() -> new RuntimeException("Medicine product not found with id: " + id));
    }

    // ⚡ NEW: Purge/Delete a medicine record out of rows completely
    public String deleteMedicine(Long id) {
        if (medicineRepository.existsById(id)) {
            medicineRepository.deleteById(id);
            return "Medicine dropped successfully!";
        } else {
            throw new RuntimeException("Medicine product not found with id: " + id);
        }
    }
}
