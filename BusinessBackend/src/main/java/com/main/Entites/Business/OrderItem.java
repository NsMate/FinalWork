package com.main.Entites.Business;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
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
    @Size(max = 7)
    private BigDecimal quantity;

    @Column(name = "discount")
    private BigDecimal discount;

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    @JsonIgnore
    private BusinessOrder businessOrder;

    @Column(name = "product")
    @NotNull
    @Size(max = 30)
    private String product;

    @Column(name = "description")
    @Size(max = 50)
    private String description;

    @Column(name = "unit")
    @NotNull
    @Size(max = 10)
    private String unit;

    @Column(name = "price")
    @NotNull
    @Size(max = 7)
    private String price;
}
