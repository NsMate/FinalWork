package com.main.BusinessTests.InvoiceTest;

import com.main.Entites.Business.Invoice;
import com.main.Entites.Business.Partner;
import com.main.Repositories.Business.InvoiceRepository;
import com.main.Repositories.Business.PartnerRepository;
import com.main.Repositories.Warehouse.RouteRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.Date;
import java.util.List;

@RunWith(SpringRunner.class)
@DataJpaTest
@ActiveProfiles("test")
public class InvoiceRespositoryTest {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PartnerRepository partnerRepository;

    @Autowired
    private RouteRepository routeRepository;

    public Partner createPartner(){
        Partner partner = new Partner();
        partner.setCity("Budapest");
        partner.setContactEmail("test@test");
        partner.setContactFirstName("Nagy");
        partner.setContactLastName("Test");
        partner.setContactPhoneNumber("+361111112");
        partner.setPartnerName("Test Company");
        partner.setStreet("Test Strett");
        partner.setZipCode(1111);
        partner.setOwn(0);
        partner.setStreetNumber(12);
        return partnerRepository.save(partner);
    }
    public Invoice createInvoice(Partner partner){
        Invoice invoice = new Invoice();
        invoice.setIssueDate(Date.valueOf("2020-03-12"));
        invoice.setDueDate(Date.valueOf("2020-03-12"));
        invoice.setPartner(partner);
        invoice.setVat("27");
        invoice.setPaymentType("Átutalás");
        invoice.setStatus("OPEN");
        return invoiceRepository.save(invoice);
    }

    @Test
    public void getAllFreeInvoicesFromDb(){
        invoiceRepository.deleteAll();
        Partner partner = createPartner();
        Invoice good = createInvoice(partner);
        good.setStatus("CLOSED");
        Invoice good1 = createInvoice(partner);
        good1.setStatus("CLOSED");
        Invoice bad = createInvoice(partner);
        bad.setStatus("DONE");
        Invoice bad1 = createInvoice(partner);
        bad1.setStatus("OPEN");

        List<Invoice> invoices = invoiceRepository.findClosedInvoices();

        Assert.assertEquals(2,invoices.size());
    }
}
