package com.itvedant.dr215.MedicareApp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

import javax.xml.catalog.Catalog;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class Medicine{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Category field is required")
    private String category;
    @Positive(message = "Price value below  not allowed")
    private double price;
    @NotBlank(message = "Description Field is Required")
    private String description;
    private String image;

    @JsonIgnore
    @OneToMany(mappedBy = "medicine")
    private List<CartItem> cartItem;


}
