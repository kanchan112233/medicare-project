package com.itvedant.dr215.MedicareApp.repository;

import com.itvedant.dr215.MedicareApp.entity.LabBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LabBookingRepository extends JpaRepository<LabBooking, Long> {
    List<LabBooking> findByUser_Id(Long userId);
}
