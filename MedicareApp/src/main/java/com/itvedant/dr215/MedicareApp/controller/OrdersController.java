package com.itvedant.dr215.MedicareApp.controller;

import com.itvedant.dr215.MedicareApp.entity.Orders;
import com.itvedant.dr215.MedicareApp.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicare/order")
@CrossOrigin(origins = "http://localhost:5173") // Connects to Vite front-end client
public class OrdersController {

    @Autowired
    private OrdersService ordersService;

    @PostMapping("/placeorder") // Maps to: POST http://localhost:8087/medicare/order/placeorder
    public ResponseEntity<?> placeOrder(@RequestBody Orders order) {
        return new ResponseEntity<>(ordersService.placeOrder(order), HttpStatus.CREATED);
    }

    @GetMapping("/getOrder/{id}") // Maps to: GET http://localhost:8087/medicare/order/getOrder/{id}
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        Orders order = ordersService.getOrderByID(id);
        if (order == null) {
            return new ResponseEntity<>("Order Not Found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUserId(
            @PathVariable Long userId) {

        return new ResponseEntity<>(
                ordersService.getOrdersByUserId(userId),
                HttpStatus.OK
        );
    }

    @GetMapping("/getAllOrders") // Maps to: GET http://localhost:8087/medicare/order/getAllOrders
    public ResponseEntity<List<Orders>> getALlOrders() {
        return new ResponseEntity<>(ordersService.getALlOrders(), HttpStatus.OK);
    }

    @DeleteMapping("/cancelOrder/{id}") // Maps to: DELETE http://localhost:8087/medicare/order/cancelOrder/{id}
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        return new ResponseEntity<>(ordersService.cancelOrder(id), HttpStatus.OK);
    }
}
