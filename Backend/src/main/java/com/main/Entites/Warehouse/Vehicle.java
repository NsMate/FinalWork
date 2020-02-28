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

    public void setRouteList(List<Route> routeList) {
        this.routeList = routeList;
    }

    public Long getId() {
        return id;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public String getLicensePlateNumber() {
        return licensePlateNumber;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public void setLicensePlateNumber(String licensePlateNumber) {
        this.licensePlateNumber = licensePlateNumber;
    }
}
