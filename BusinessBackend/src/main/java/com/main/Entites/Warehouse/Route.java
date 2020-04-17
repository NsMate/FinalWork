package com.main.Entites.Warehouse;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.main.Entites.Business.BusinessOrder;
import com.main.Entites.Business.Invoice;
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
public class Route implements Serializable{

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "route_type")
    @NotNull
    private String routeType;

    @Column(name = "destination")
    private String destination;

    @Column(name = "delivery_date")
    @NotNull
    private Date deliveryDate;

    @ManyToOne
    @JoinColumn(name = "warehouse_id", referencedColumnName = "id")
    private Warehouse warehouse;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", referencedColumnName = "id")
    private Vehicle vehicle;

    @OneToOne
    @JoinColumn(name = "invoice_id", referencedColumnName = "id")
    private Invoice invoice;

    @OneToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private BusinessOrder businessOrder;
}
