package com.main.Entites.Business;

import com.fasterxml.jackson.annotation.*;
import com.main.Entites.Warehouse.Stock;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Table(name = "product")
public class Product implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "product_name")
    @NotNull
    @Size(max = 30)
    private String productName;

    @Column(name = "price")
    @NotNull
    @Size(max = 8)
    private BigDecimal price;

    @Column(name = "product_description")
    @Size(max = 255)
    private String productDescription;

    @Column(name = "code")
    @NotNull
    @Size(max = 4)
    private int code;

    @Column(name = "currency")
    @NotNull
    private String currency;

    @OneToMany(mappedBy = "product")
    @JsonIgnore
    private List<Stock> stockList;

    @ManyToOne
    @JoinColumn(name = "product_group_id", referencedColumnName = "id")
    @JsonIgnore
    private ProductGroup productGroup;
}
