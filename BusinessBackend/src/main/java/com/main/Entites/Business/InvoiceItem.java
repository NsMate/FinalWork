package com.main.Entites.Business;

import com.fasterxml.jackson.annotation.*;
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
@Table(name = "invoice_item")
public class InvoiceItem implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "quantity")
    private BigDecimal quantity;

    @Column(name = "discount")
    private BigDecimal discount;

    @ManyToOne
    @JoinColumn(name = "invoice_id", referencedColumnName = "id")
    @JsonIgnore
    private Invoice invoice;

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
