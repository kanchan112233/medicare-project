package com.itvedant.dr215.MedicareApp.controller;

import com.itvedant.dr215.MedicareApp.entity.CartItem;
import com.itvedant.dr215.MedicareApp.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/medicare/cartitem")
@CrossOrigin(origins = "http://localhost:5173")
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

    @PostMapping("/addtocart")
    public ResponseEntity<CartItem> saveCartItem(@RequestBody CartItem cartItem) {
        CartItem saved = cartItemService.addtocart(cartItem);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/getAllCartItems")
    public ResponseEntity<?> getAllCartItems() {
        return new ResponseEntity<>(cartItemService.getAll(), HttpStatus.OK);
    }

    @DeleteMapping("/deleteItem/{id}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Long id) {
        return new ResponseEntity<>(cartItemService.delete(id), HttpStatus.OK);
    }

    @PutMapping("/updatequantity/{id}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long id, @RequestParam int quantity) {
        return new ResponseEntity<>(cartItemService.updateQuantity(id, quantity), HttpStatus.OK);
    }
}
