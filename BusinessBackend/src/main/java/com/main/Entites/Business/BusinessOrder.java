package com.main.Entites.Business;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.main.Entites.Warehouse.Route;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.sql.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "business_order")
public class BusinessOrder implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "issue_date")
    @CreationTimestamp
    private Date issueDate;

    @Column(name = "due_date")
    private Date dueDate;

    @Column(name = "order_description")
    private String orderDescription;

    @Column(name = "vat")
    @NotNull
    private String vat;

    @Column(name = "status")
    @NotNull
    private String status;

    @Column(name = "payment_type")
    @NotNull
    private String paymentType;

    @OneToMany(mappedBy = "businessOrder", cascade = CascadeType.REMOVE)
    private List<OrderItem> orderItemList;

    @ManyToOne
    @JoinColumn(name = "partner_id",referencedColumnName = "id")
    private Partner partner;

    @OneToOne(mappedBy = "businessOrder", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private Route route;
}
