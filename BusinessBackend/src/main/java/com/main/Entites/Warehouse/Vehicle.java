package com.main.Entites.Warehouse;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class Vehicle implements Serializable{

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

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.REMOVE
    )
    @JsonIgnore
    private List<Route> routeList;

    @ManyToOne
    @JoinColumn(name = "warehouse_id", referencedColumnName = "id")
    @JsonIgnore
    private Warehouse warehouse;
}
