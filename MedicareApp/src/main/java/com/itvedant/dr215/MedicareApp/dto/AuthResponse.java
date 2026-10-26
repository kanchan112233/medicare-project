package com.itvedant.dr215.MedicareApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String token;
    private String message;
}