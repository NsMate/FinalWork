package com.main.Entites.Business;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "order_item")
public class OrderItem implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "quantity")
    private BigDecimal quantity;

    @Column(name = "discount")
    private BigDecimal discount;

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    @JsonIgnore
    private BusinessOrder businessOrder;

    @Column(name = "product")
    @NotNull
    private String product;

    @Column(name = "description")
    private String description;

    @Column(name = "unit")
    @NotNull
    private String unit;

    @Column(name = "price")
    @NotNull
    private String price;
}
