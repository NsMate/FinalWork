package com.main.Entites.Business;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
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

    @OneToMany(mappedBy = "invoice")
    private List<InvoiceItem> invoiceItems;

    @ManyToOne
    @JoinColumn(name = "partner_id",referencedColumnName = "id")
    @JsonIgnore
    private Partner partner;
}
