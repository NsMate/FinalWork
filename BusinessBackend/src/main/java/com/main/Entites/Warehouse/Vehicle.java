package com.main.Entites.Warehouse;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Vehicle implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "manufacturer")
    @NotNull
    private String manufacturer;

    @Column(name = "vehicle_type")
    @NotNull
    private String vehicleType;

    @Column(name = "license_plate_number")
    @NotNull
    private String licensePlateNumber;

    @OneToMany(mappedBy = "vehicle")
    private List<Route> routeList;

    public List<Route> getRouteList() {
        return routeList;
    }
}
