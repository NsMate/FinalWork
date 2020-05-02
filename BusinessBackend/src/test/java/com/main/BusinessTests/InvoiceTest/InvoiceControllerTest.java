package com.main.BusinessTests.InvoiceTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.main.Controllers.Business.InvoiceController;
import com.main.Entites.Business.Invoice;
import com.main.Entites.Business.InvoiceItem;
import com.main.Entites.Business.Partner;
import com.main.Repositories.Business.InvoiceItemRepository;
import com.main.Repositories.Business.InvoiceRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
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

@WebMvcTest(InvoiceController.class)
@RunWith(SpringRunner.class)
public class InvoiceControllerTest {

    @Autowired
    MockMvc mvc;

    private ObjectMapper mapper = new ObjectMapper();

    @MockBean
    private InvoiceRepository invoiceRepository;
    @MockBean
    private InvoiceItemRepository invoiceItemRepository;

    @Before
    public void before(){
        MockitoAnnotations.initMocks(this);
    }

    public Invoice createInvoice(){
        Invoice invoice = new Invoice();
        invoice.setIssueDate(Date.valueOf("2020-03-12"));
        invoice.setDueDate(Date.valueOf("2020-03-12"));
        invoice.setPartner(new Partner());
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
    public void getAllInvoiceEndpointTest() throws Exception {
        Invoice inv = createInvoice();
        Invoice inv2 = createInvoice();
        inv.setId(1L);
        inv2.setId(2L);

        List<Invoice> invoices = new ArrayList<>();
        invoices.add(inv);
        invoices.add(inv2);

        Mockito.when(invoiceRepository.findAll()).thenReturn(invoices);

        mvc.perform(get("/invoices")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andReturn();

        Mockito.verify(invoiceRepository,Mockito.times(1)).findAll();
    }

    @Test
    public void getInvoiceByIdEndpointTest() throws Exception {
        Invoice inv = createInvoice();
        inv.setId(1L);

        Mockito.when(invoiceRepository.findById(1L)).thenReturn(Optional.of(inv));

        mvc.perform(get("/invoices/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn();

        Mockito.verify(invoiceRepository,Mockito.times(1)).findById(1L);
    }

    @Test
    public void postInvoiceEndpointTest() throws Exception {
        Invoice inv = createInvoice();
        inv.setId(1L);

        Mockito.when(invoiceRepository.save(inv)).thenReturn(inv);

        mvc.perform(post("/invoices")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(inv)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andReturn();

        Mockito.verify(invoiceRepository,Mockito.times(1)).save(inv);
    }

    @Test
    public void putInvoiceEndpointTest() throws Exception {
        Invoice inv = createInvoice();
        inv.setId(1L);

        Mockito.when(invoiceRepository.findById(1L)).thenReturn(Optional.of(inv));
        Mockito.when(invoiceRepository.save(inv)).thenReturn(inv);

        mvc.perform(put("/invoices/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(inv)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andReturn();

        Mockito.verify(invoiceRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(invoiceRepository,Mockito.times(1)).save(inv);
    }

    @Test
    public void deleteOrderItemEndpointTest() throws Exception{
        Invoice inv = createInvoice();
        inv.setId(1L);

        Mockito.when(invoiceRepository.findById(1L)).thenReturn(Optional.of(inv));

        mvc.perform(delete("/invoices/1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());

        Mockito.verify(invoiceRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(invoiceRepository,Mockito.times(1)).deleteById(1L);
    }

    @Test
    public void getAllInvoiceItemByIdEndpointTest() throws Exception {
        Invoice inv = createInvoice();
        inv.setId(1L);

        InvoiceItem item1 = createInvoiceItem(inv);
        item1.setProduct("Item1");
        InvoiceItem item2 = createInvoiceItem(inv);
        item2.setProduct("Item2");

        Mockito.when(invoiceRepository.findById(1L)).thenReturn(Optional.of(inv));

        mvc.perform(get("/invoices/1/invoice_items")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        Mockito.verify(invoiceRepository,Mockito.times(1)).findById(1L);
    }

    @Test
    public void postInvoiceItemEndpointTest() throws Exception {
        Invoice inv = createInvoice();
        inv.setId(1L);

        InvoiceItem item1 = createInvoiceItem(inv);
        item1.setProduct("Item1");

        Mockito.when(invoiceRepository.findById(1L)).thenReturn(Optional.of(inv));
        Mockito.when(invoiceItemRepository.save(item1)).thenReturn(item1);

        mvc.perform(post("/invoices/1/invoice_items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(item1)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.product").value("Item1"))
                .andReturn();

        Mockito.verify(invoiceRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(invoiceItemRepository,Mockito.times(1)).save(item1);
    }

    @Test
    public void getAllClosedInvoiceEndpointTest() throws Exception {
        Invoice inv = createInvoice();
        Invoice inv2 = createInvoice();
        inv.setId(1L);
        inv.setStatus("CLOSED");
        inv2.setId(2L);
        inv2.setStatus("CLOSED");

        List<Invoice> invoices = new ArrayList<>();
        invoices.add(inv);
        invoices.add(inv2);

        Mockito.when(invoiceRepository.findClosedInvoices()).thenReturn(invoices);

        mvc.perform(get("/invoices/closedInvoices")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].status").value("CLOSED"))
                .andExpect(jsonPath("$[1].status").value("CLOSED"))
                .andReturn();

        Mockito.verify(invoiceRepository,Mockito.times(1)).findClosedInvoices();
    }
}
