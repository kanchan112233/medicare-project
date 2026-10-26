package com.itvedant.dr215.MedicareApp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class LabTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    @NotBlank(message = "Name is required")
    private String name;
    @Positive(message = "Price Should not be in negative")
    private Double price;
    @NotBlank(message = "Description Field Should be required")
    private String description;
    @NotBlank(message = "Category Field Should be required")
    private String category;

}
