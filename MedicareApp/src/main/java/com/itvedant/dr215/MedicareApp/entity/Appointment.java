package com.itvedant.dr215.MedicareApp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"user", "doctor", "patient"})
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String appointmentdate;

    private String timeslot;

    @NotBlank(message = "Reason should not be blank")
    private String reason;

    @NotBlank(message = "Status should not be blank")
    private String status;

    @NotBlank(message = "Payment status should not be blank")
    private String paymentstatus;

    private String paymentmode;

    private Double billamount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"appointments", "orders", "password"})
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doc_id")
    @JsonIgnoreProperties({"appointments"})
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"appointments"})
    private Patient patient;
}