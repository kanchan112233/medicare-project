// src/main/java/com/itvedant/dr215/MedicareApp/repository/PaymentRepository.java
package com.itvedant.dr215.MedicareApp.repository;

import com.itvedant.dr215.MedicareApp.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Used to query specific transaction states during Razorpay verification checks
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
}
