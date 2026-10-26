package com.itvedant.dr215.MedicareApp.controller;

import com.itvedant.dr215.MedicareApp.dto.CreateOrderRequest;
import com.itvedant.dr215.MedicareApp.dto.CreateOrderResponse;
import com.itvedant.dr215.MedicareApp.dto.VerifyPaymentRequest;
import com.itvedant.dr215.MedicareApp.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173") // Connects to Vite Dev Client Server
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Maps to: POST http://localhost:8087/api/payment/create-order
    @PostMapping("/create-order")
    public ResponseEntity<CreateOrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        CreateOrderResponse response = paymentService.createRazorpayOrder(request.getAmount());
        return ResponseEntity.ok(response);
    }

    // Maps to: POST http://localhost:8087/api/payment/verify
    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        String result = paymentService.verifyAndFinalizePayment(request);
        return ResponseEntity.ok(result);
    }
}
