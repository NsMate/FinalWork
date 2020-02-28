package com.main.Entites.Warehouse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Table(name = "warehouse")
public class Warehouse implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "zip_code")
    @NotNull
    private BigDecimal zipCode;

    @Column(name = "city")
    @NotNull
    private String city;

    @Column(name = "street")
    @NotNull
    private String street;

    @Column(name = "street_number")
    @NotNull
    private String streetNumber;

    @OneToMany(mappedBy = "warehouse",cascade = CascadeType.ALL)
    private List<Stock> stockList;

    @OneToMany(mappedBy = "warehouse", cascade = CascadeType.ALL)
    private List<Route> routeList;
}
