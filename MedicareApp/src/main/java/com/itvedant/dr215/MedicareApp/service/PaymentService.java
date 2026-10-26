package com.itvedant.dr215.MedicareApp.service;

import com.itvedant.dr215.MedicareApp.dto.CreateOrderResponse;
import com.itvedant.dr215.MedicareApp.dto.VerifyPaymentRequest;
import com.itvedant.dr215.MedicareApp.entity.Orders;
import com.itvedant.dr215.MedicareApp.entity.CartItem;
import com.itvedant.dr215.MedicareApp.entity.User;
import com.itvedant.dr215.MedicareApp.entity.Payment;
import com.itvedant.dr215.MedicareApp.repository.OrdersRepository;
import com.itvedant.dr215.MedicareApp.repository.CartItemRepository;
import com.itvedant.dr215.MedicareApp.repository.UserRepository;
import com.itvedant.dr215.MedicareApp.repository.PaymentRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    private final OrdersRepository ordersRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final RestTemplate restTemplate;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public PaymentService(
            OrdersRepository ordersRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            PaymentRepository paymentRepository) {
        this.ordersRepository = ordersRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.restTemplate = new RestTemplate(); // Safe initialization for outbound JSON streams
    }

    public CreateOrderResponse createRazorpayOrder(Long amountInRupees) {
        if (amountInRupees == null || amountInRupees <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        long amountInPaise = amountInRupees * 100;
        String receipt = "rcpt_" + UUID.randomUUID().toString().replace("-", "").substring(0, 20);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("amount", amountInPaise);
        requestBody.put("currency", "INR");
        requestBody.put("receipt", receipt);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth(keyId, keySecret);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://api.razorpay.com/v1/orders",
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null || !responseBody.containsKey("id")) {
                throw new RuntimeException("Failed to read Order ID from Razorpay response.");
            }

            String razorpayOrderId = (String) responseBody.get("id");

            Payment payment = new Payment();
            payment.setRazorpayOrderId(razorpayOrderId);
            payment.setAmount(amountInPaise);
            payment.setCurrency("INR");
            payment.setStatus("CREATED");
            payment.setCreatedAt(LocalDateTime.now());
            paymentRepository.save(payment);

            return new CreateOrderResponse(keyId, razorpayOrderId, amountInPaise, "INR");
        } catch (Exception e) {
            throw new RuntimeException("External gateway handshake exception: " + e.getMessage(), e);
        }
    }


    @Transactional
    public String verifyAndFinalizePayment(VerifyPaymentRequest request) {
        try {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("Active profile context not found"));

            List<CartItem> activeCartRows = cartItemRepository.findByUserid(request.getUserId());

            double calculatedTotal = activeCartRows.stream()
                    .mapToDouble(item -> (item.getMedicine() != null ? item.getMedicine().getPrice() : 0.0) * item.getQuantity())
                    .sum();

            // 1. CASH ON DELIVERY (COD) பிரத்யேக லாஜிக்
            if ("CASH".equalsIgnoreCase(request.getRazorpaySignature())) {

                // Payment டேபிளில் புதிய ரோவைச் சேமித்தல்
                Payment payment = new Payment();
                payment.setRazorpayOrderId(request.getRazorpayOrderId());
                payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
                payment.setRazorpaySignature("CASH");
                payment.setAmount((long) (calculatedTotal * 100)); // பைசாவாக மாற்ற
                payment.setCurrency("INR");
                payment.setStatus("SUCCESS");
                payment.setCreatedAt(LocalDateTime.now());
                paymentRepository.save(payment);

                // Orders டேபிளில் புதிய ஆர்டரைச் சேமித்தல்
                Orders order = new Orders();
                order.setUser(user);
                order.setTotalamount(calculatedTotal > 0 ? calculatedTotal : 1.0);
                order.setStatus("Placed");
                order.setPaymentstatus("PENDING_COD"); // டெலிவரியின் போது பணம் பெறப்படும்
                order.setCreatedAt(LocalDateTime.now());
                ordersRepository.save(order); // 👈 டேட்டாபேஸில் ஆர்டர் சேமிக்கப்படுகிறது!

                // கார்ட்டை காலி செய்தல்
                for (CartItem item : activeCartRows) {
                    cartItemRepository.delete(item);
                }

                return "SUCCESS";
            }

            //  2. RAZORPAY ஆன்லைன் பேமெண்ட் சிக்னேச்சர் சரிபார்ப்பு லாஜிக்
            String generatedPayload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();

            SecretKeySpec secretKeySpec = new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(secretKeySpec);

            byte[] rawHmac = mac.doFinal(generatedPayload.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : rawHmac) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            String computedSignature = hexString.toString();

            if (computedSignature.equalsIgnoreCase(request.getRazorpaySignature())) {
                Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                        .orElseThrow(() -> new RuntimeException("Payment reference record not found"));

                payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
                payment.setRazorpaySignature(request.getRazorpaySignature());
                payment.setStatus("SUCCESS");
                paymentRepository.save(payment);

                Orders order = new Orders();
                order.setUser(user);
                order.setTotalamount(calculatedTotal > 0 ? calculatedTotal : 1.0);
                order.setStatus("Placed");
                order.setPaymentstatus("PAID");
                order.setCreatedAt(LocalDateTime.now());
                ordersRepository.save(order); // 👈 ஆன்லைன் ஆர்டர் சேமிக்கப்படுகிறது!

                for (CartItem item : activeCartRows) {
                    cartItemRepository.delete(item);
                }

                return "SUCCESS";
            } else {
                return "FAILED";
            }
        } catch (Exception e) {
            throw new RuntimeException("Cryptographic tracking computation breakdown: " + e.getMessage());
        }
    }
}
