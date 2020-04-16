package com.main.Entites.Business;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Table(name = "partner")
public class Partner implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "partner_name")
    @NotNull
    private String partnerName;

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
    private BigDecimal streetNumber;

    @Column(name = "contact_first_name")
    @NotNull
    private String contactFirstName;

    @Column(name = "contact_last_name")
    @NotNull
    private String contactLastName;

    @Column(name = "contact_email")
    @NotNull
    private String contactEmail;

    @Column(name = "contact_phone_number")
    @NotNull
    private String contactPhoneNumber;

    @Column(name = "vat_number")
    @NotNull
    private String vatNumber;

    @Column(name = "partnership_type")
    @NotNull
    private String partnershipType;

    @Column(name = "own")
    private int own;

    @OneToMany(mappedBy = "partner", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<Invoice> invoices;

    @OneToMany(mappedBy = "partner", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<BusinessOrder> businessOrders;
}
