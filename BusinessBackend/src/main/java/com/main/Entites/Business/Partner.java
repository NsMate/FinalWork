package com.main.Entites.Business;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @Size(min = 3, max = 40)
    private String partnerName;

    @Column(name = "zip_code")
    @NotNull
    private int zipCode;

    @Column(name = "city")
    @NotNull
    @Size(max = 40)
    private String city;

    @Column(name = "street")
    @NotNull
    @Size(max = 40)
    private String street;

    @Column(name = "street_number")
    @NotNull
    private int streetNumber;

    @Column(name = "contact_first_name")
    @NotNull
    @Size(max = 30)
    private String contactFirstName;

    @Column(name = "contact_last_name")
    @NotNull
    @Size(max = 25)
    private String contactLastName;

    @Column(name = "contact_email")
    @NotNull
    @Size(max = 30)
    private String contactEmail;

    @Column(name = "contact_phone_number")
    @NotNull
    private String contactPhoneNumber;

    @Column(name = "vat_number")
    private String vatNumber;

    @Column(name = "partnership_type")
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
