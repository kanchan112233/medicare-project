// src/main/java/com/itvedant/dr215/MedicareApp/entity/User.java
package com.itvedant.dr215.MedicareApp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore; // Ensure this import is present
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {
        "appointments",
        "orders"
})
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    private String name;

    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String phone;

    private String role;

    private String image;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Appointment> appointments;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Orders> orders;
}