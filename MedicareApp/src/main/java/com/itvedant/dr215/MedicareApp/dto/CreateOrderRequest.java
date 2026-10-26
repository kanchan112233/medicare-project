// src/main/java/com/itvedant/dr215/MedicareApp/dto/CreateOrderRequest.java
package com.itvedant.dr215.MedicareApp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class CreateOrderRequest {
    @NotNull
    @Min(1)
    private Long amount;

    @NotNull
    private Long userId;
}
