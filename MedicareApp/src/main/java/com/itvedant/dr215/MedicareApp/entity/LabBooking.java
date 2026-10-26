package com.itvedant.dr215.MedicareApp.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class LabBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lab_test_id")
    private LabTest labTest;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Double billamount;
    private String paymentmode;
    private String status;
    private String paymentstatus;

    private String appointmentDate;

    @Column(name = "created_at", columnDefinition = "DATETIME")
    @JsonProperty("createdAt")
    private LocalDateTime createdAt = LocalDateTime.now();
}
