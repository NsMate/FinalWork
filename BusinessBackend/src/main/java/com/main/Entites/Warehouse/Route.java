package com.main.Entites.Warehouse;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.sql.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Table(name = "route")
public class Route implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "route_type")
    @NotNull
    private String routeType;

    @Column(name = "destination")
    @NotNull
    private String destination;

    @Column(name = "delivery_date")
    @NotNull
    private Date deliveryDate;

    @ManyToOne
    @JoinColumn(name = "warehouse_id", referencedColumnName = "id")
    @JsonIgnore
    private Warehouse warehouse;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", referencedColumnName = "id")
    @JsonIgnore
    private Vehicle vehicle;

    @OneToOne(mappedBy = "route")
    @JsonIgnore
    private CalendarEvent calendarEvent;
}
