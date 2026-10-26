package com.itvedant.dr215.MedicareApp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doc_id")
    private  Long id;
    @NotBlank(message = "Name is Required")
    private String name;
    @NotBlank(message = "Specialization is Required")
    private String specialization;
    @Min(value = 1,message = "Experience must bt alteast 1 year")
    private Integer experience;
    @Positive(message = "Fees should be positive")
    private Double fees;
    @NotBlank(message = "Description Should not be blank")
    private String description;
    private String image;

    @JsonIgnore
    @OneToMany(mappedBy = "doctor")
    private List<Appointment> appointments;



}
