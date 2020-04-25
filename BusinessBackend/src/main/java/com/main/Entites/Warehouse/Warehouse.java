package com.main.Entites.Warehouse;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.main.Entites.User.Employee;
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
    @Size(max = 30)
    private String city;

    @Column(name = "street")
    @NotNull
    @Size(max = 30)
    private String street;

    @Column(name = "street_number")
    @NotNull
    @Size(max = 6)
    private String streetNumber;

    @OneToMany(mappedBy = "warehouse")
    private List<Employee> employeeList;

    @OneToMany(mappedBy = "warehouse", cascade = CascadeType.REMOVE)
    private List<Stock> stockList;

    @OneToMany(mappedBy = "warehouse", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<Route> routeList;

    @OneToMany(mappedBy = "warehouse")
    private List<Vehicle> vehicleList;
}
