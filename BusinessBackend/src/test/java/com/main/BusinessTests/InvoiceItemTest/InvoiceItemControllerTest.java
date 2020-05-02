package com.main.BusinessTests.InvoiceItemTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.main.Controllers.Business.InvoiceItemController;
import com.main.Entites.Business.*;
import com.main.Repositories.Business.InvoiceItemRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(InvoiceItemController.class)
@RunWith(SpringRunner.class)
public class InvoiceItemControllerTest {

    @Autowired
    MockMvc mvc;

    private ObjectMapper mapper = new ObjectMapper();

    @MockBean
    private InvoiceItemRepository invoiceItemRepository;

    public ProductGroup createProductGroup(){
        ProductGroup productGroup = new ProductGroup();
        productGroup.setGroupName("Test");
        return productGroup;
    }
    public Product createProduct(){
        Product product = new Product();
        product.setProductName("TestProduct");
        product.setCode(1000);
        product.setPrice(100);
        return product;
    }
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
        return partner;
    }
    public Invoice createInvoice(Partner partner){
        Invoice invoice = new Invoice();
        invoice.setIssueDate(Date.valueOf("2020-03-12"));
        invoice.setDueDate(Date.valueOf("2020-03-12"));
        invoice.setPartner(partner);
        invoice.setVat("27");
        invoice.setPaymentType("Átutalás");
        invoice.setStatus("OPEN");
        return invoice;
    }
    public InvoiceItem createInvoiceItem(Invoice invoice){
        InvoiceItem item = new InvoiceItem();
        item.setProduct("Test");
        item.setInvoice(invoice);
        item.setQuantity(10);
        item.setUnit("db");
        item.setPrice("1000");
        return item;
    }

    @Test
    public void getAllInvoiceItemItemEndpointTest() throws Exception {
        Partner partner = createPartner();
        Invoice invoice = createInvoice(partner);
        InvoiceItem invoiceItem1 = createInvoiceItem(invoice);
        invoiceItem1.setProduct("test1");
        InvoiceItem invoiceItem2 = createInvoiceItem(invoice);
        invoiceItem2.setProduct("test2");
        List<InvoiceItem> items = new ArrayList<>();
        items.add(invoiceItem1);
        items.add(invoiceItem2);

        Mockito.when(invoiceItemRepository.findAll()).thenReturn(items);

        mvc.perform(get("/invoice_items")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].product").value("test1"))
                .andExpect(jsonPath("$[1].product").value("test2"))
                .andReturn();

        Mockito.verify(invoiceItemRepository,Mockito.times(1)).findAll();
    }

    @Test
    public void getInvoiceItemByIdItemEndpointTest() throws Exception {
        Partner partner = createPartner();
        Invoice invoice = createInvoice(partner);
        InvoiceItem invoiceItem1 = createInvoiceItem(invoice);
        invoiceItem1.setProduct("test1");
        invoiceItem1.setId(1L);

        Mockito.when(invoiceItemRepository.findById(1L)).thenReturn(Optional.of(invoiceItem1));

        mvc.perform(get("/invoice_items/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.product").value("test1"))
                .andReturn();

        Mockito.verify(invoiceItemRepository,Mockito.times(1)).findById(1L);
    }

    @Test
    public void postInvoiceItemByIdItemEndpointTest() throws Exception {
        Partner partner = createPartner();
        Invoice invoice = createInvoice(partner);
        InvoiceItem invoiceItem1 = createInvoiceItem(invoice);
        invoiceItem1.setProduct("test1");
        invoiceItem1.setId(1L);

        Mockito.when(invoiceItemRepository.save(invoiceItem1)).thenReturn(invoiceItem1);

        mvc.perform(post("/invoice_items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(invoiceItem1)))
                .andExpect(status().isOk())
                .andReturn();

    }

    @Test
    public void putInvoiceItemByIdItemEndpointTest() throws Exception {
        Partner partner = createPartner();
        Invoice invoice = createInvoice(partner);
        InvoiceItem invoiceItem1 = createInvoiceItem(invoice);
        invoiceItem1.setProduct("test1");
        invoiceItem1.setId(1L);

        Mockito.when(invoiceItemRepository.findById(1L)).thenReturn(Optional.of(invoiceItem1));
        Mockito.when(invoiceItemRepository.save(invoiceItem1)).thenReturn(invoiceItem1);

        mvc.perform(put("/invoice_items/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(invoiceItem1)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.product").value("test1"))
                .andReturn();

        Mockito.verify(invoiceItemRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(invoiceItemRepository,Mockito.times(1)).save(invoiceItem1);
    }

    @Test
    public void deleteOrderItemEndpointTest() throws Exception{
        Partner partner = createPartner();
        Invoice invoice = createInvoice(partner);
        InvoiceItem invoiceItem1 = createInvoiceItem(invoice);
        invoiceItem1.setProduct("test1");
        invoiceItem1.setId(1L);

        Mockito.when(invoiceItemRepository.findById(1L)).thenReturn(Optional.of(invoiceItem1));

        mvc.perform(delete("/invoice_items/1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());

        Mockito.verify(invoiceItemRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(invoiceItemRepository,Mockito.times(1)).deleteById(1L);
    }

}
