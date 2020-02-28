package com.main.Entites.Business;

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
    private String contactFirtName;

    @Column(name = "contact_last_name")
    @NotNull
    private String contactLastName;

    @Column(name = "contact_email")
    @NotNull
    private String contactEmail;

    @Column(name = "contact_phone_number")
    @NotNull
    private String contactPhoneNumber;

    @Column(name = "currency_type")
    @NotNull
    private String currencyType;

    @Column(name = "partnership_type")
    @NotNull
    private String partnershipType;

    @OneToMany(mappedBy = "partner")
    private List<Invoice> invoices;

    @OneToMany(mappedBy = "partner")
    private List<BusinessOrder> businessOrders;

    //Getters and setters for the entity

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPartnerName() {
        return partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

    public BigDecimal getZipCode() {
        return zipCode;
    }

    public void setZipCode(BigDecimal zipCode) {
        this.zipCode = zipCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public BigDecimal getStreetNumber() {
        return streetNumber;
    }

    public void setStreetNumber(BigDecimal streetNumber) {
        this.streetNumber = streetNumber;
    }

    public String getContactFirtName() {
        return contactFirtName;
    }

    public void setContactFirtName(String contactFirtName) {
        this.contactFirtName = contactFirtName;
    }

    public String getContactLastName() {
        return contactLastName;
    }

    public void setContactLastName(String contactLastName) {
        this.contactLastName = contactLastName;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhoneNumber() {
        return contactPhoneNumber;
    }

    public void setContactPhoneNumber(String contactPhoneNumber) {
        this.contactPhoneNumber = contactPhoneNumber;
    }

    public String getCurrencyType() {
        return currencyType;
    }

    public void setCurrencyType(String currencyType) {
        this.currencyType = currencyType;
    }

    public String getPartnershipType() {
        return partnershipType;
    }

    public void setPartnershipType(String partnershipType) {
        this.partnershipType = partnershipType;
    }

    public List<Invoice> getInvoices() {
        return invoices;
    }

    public void setInvoices(List<Invoice> invoices) {
        this.invoices = invoices;
    }

    public List<BusinessOrder> getBusinessOrders() {
        return businessOrders;
    }

    public void setBusinessOrders(List<BusinessOrder> businessOrders) {
        this.businessOrders = businessOrders;
    }
}
