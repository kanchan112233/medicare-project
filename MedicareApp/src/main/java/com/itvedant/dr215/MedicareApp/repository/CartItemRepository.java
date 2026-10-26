package com.itvedant.dr215.MedicareApp.repository;

import com.itvedant.dr215.MedicareApp.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserid(Long userid);
}
