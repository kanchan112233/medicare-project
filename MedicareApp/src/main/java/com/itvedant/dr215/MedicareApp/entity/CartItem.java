package com.itvedant.dr215.MedicareApp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long id;
    private Long userid;
    private Long medicineid;
    private Integer quantity;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Orders orders;


}