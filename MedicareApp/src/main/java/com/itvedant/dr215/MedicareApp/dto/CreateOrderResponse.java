package com.itvedant.dr215.MedicareApp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderResponse {
    private String keyId;
    private String orderId;
    private Long amount;
    private String currency;
}
