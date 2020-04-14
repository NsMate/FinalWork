package com.main.Entites.Warehouse;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.main.Entites.Business.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Table(name = "stock")
public class Stock implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "quantity")
    private BigDecimal quantity;

    @ManyToOne
    @JoinColumn(name = "warehouse_id", referencedColumnName = "id")
    @JsonIgnore
    private Warehouse warehouse;

    @Column(name = "product")
    private String product;

    @Column(name = "unit")
    @NotNull
    private String unit;
}
