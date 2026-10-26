package com.itvedant.dr215.MedicareApp.repository;

import com.itvedant.dr215.MedicareApp.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByUserId(Long userId);

}
