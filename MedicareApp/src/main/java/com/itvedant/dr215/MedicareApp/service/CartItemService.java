// src/main/java/com/itvedant/dr215/MedicareApp/service/CartItemService.java
package com.itvedant.dr215.MedicareApp.service;

import com.itvedant.dr215.MedicareApp.entity.CartItem;
import com.itvedant.dr215.MedicareApp.entity.Medicine;
import com.itvedant.dr215.MedicareApp.repository.CartItemRepository;
import com.itvedant.dr215.MedicareApp.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    public CartItem addtocart(CartItem cartItem) {
        if (cartItem.getMedicineid() != null) {
            Medicine dbMedicine = medicineRepository.findById(cartItem.getMedicineid()).orElse(null);
            cartItem.setMedicine(dbMedicine);
        }

        List<CartItem> cartItemList = cartItemRepository.findAll();
        for (CartItem c : cartItemList) {
            if (c.getUserid().equals(cartItem.getUserid())
                    && c.getMedicineid().equals(cartItem.getMedicineid())) {
                c.setQuantity(c.getQuantity() + cartItem.getQuantity());
                return cartItemRepository.save(c);
            }
        }
        return cartItemRepository.save(cartItem);
    }

    public List<CartItem> getAll() {
        return cartItemRepository.findAll();
    }

    public Boolean delete(Long id) {
        if (cartItemRepository.existsById(id)) {
            cartItemRepository.deleteById(id);
            return true;
        }
        return true; // Returns true gracefully if row was already deleted by another transaction link
    }

    public CartItem updateQuantity(Long id, int quantity) {
        Optional<CartItem> OptCartItem = cartItemRepository.findById(id);
        if (OptCartItem.isPresent()) {
            CartItem existingCartItem = OptCartItem.get();
            existingCartItem.setQuantity(quantity);
            return cartItemRepository.save(existingCartItem);
        } else {
            throw new RuntimeException("Cart Item Not Found");
        }
    }
}
