package com.main.Entites.Business;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.main.Entites.User.AppUser;
import com.main.Entites.Warehouse.Route;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.sql.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Table(name = "invoice")
public class Invoice implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "issue_date")
    @CreationTimestamp
    private Date issueDate;

    @Column(name = "due_date")
    private Date dueDate;

    @Column(name = "invoice_description")
    private String invoiceDescription;

    @Column(name = "vat")
    @NotNull
    private String vat;

    @Column(name = "status")
    @NotNull
    private String status;

    @Column(name = "payment_type")
    @NotNull
    private String paymentType;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.REMOVE)
    private List<InvoiceItem> invoiceItems;

    @ManyToOne
    @JoinColumn(name = "partner_id",referencedColumnName = "id")
    private Partner partner;

    @OneToOne
    @JoinColumn(name = "route_id", referencedColumnName = "id")
    @JsonIgnore
    private Route route;
}
