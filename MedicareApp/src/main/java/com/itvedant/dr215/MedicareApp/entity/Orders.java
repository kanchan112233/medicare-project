package com.itvedant.dr215.MedicareApp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "orders")   // avoid reserved keyword
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="order_id")
    private Long id;

    @Positive(message = "Total Amount Should be Above 0")
    private double totalamount;

    @NotBlank(message = "Status Should not be Blank")
    private String status;

    @NotBlank(message = "Payment Should not be blank")
    private String paymentstatus;

    @NotNull(message = "Created date should not be null")
    @Column(name = "created_at", columnDefinition = "DATETIME")  // ✅ fixes datetime(6) issue
    private LocalDateTime createdAt;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")  // matches User PK
    private User user;

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("orders")
    @OneToMany(mappedBy = "orders")
    private List<CartItem> cartItem;
}
