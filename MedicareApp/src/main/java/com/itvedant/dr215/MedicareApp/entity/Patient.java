package com.itvedant.dr215.MedicareApp.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "FirstName is Required")
    private String firstname;
    @NotBlank(message = "LastName is Required")
    private String lastname;
    private String gender;
    private LocalDate birthdate;
    @Size(max=10,message = "Phone No Should be 10 Digits")
    private String phone;
    @Email(message = "Incorrect Format")
    private String email;
    @NotBlank(message = "Address is Required")
    private String address;
    @NotBlank(message = "BloodGroup is Required")
    private String bloodgroup;
    private LocalDate registrationdate;


}
