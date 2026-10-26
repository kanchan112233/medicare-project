package com.itvedant.dr215.MedicareApp.repository;

import com.itvedant.dr215.MedicareApp.entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabTestRepository extends JpaRepository<LabTest, Long> {
}
