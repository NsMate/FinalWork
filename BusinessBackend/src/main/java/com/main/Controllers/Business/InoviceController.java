package com.main.Controllers.Business;

import com.main.Entites.Business.Invoice;
import com.main.Entites.Business.InvoiceItem;
import com.main.Repositories.Business.InvoiceItemRepository;
import com.main.Repositories.Business.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/invoices")
public class InoviceController {

    @Autowired
    private InvoiceRepository invoiceRepository;
    @Autowired
    private InvoiceItemRepository invoiceItemRepository;

    @GetMapping("")
    public ResponseEntity<Iterable<Invoice>> getAll(){
        return ResponseEntity.ok(invoiceRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInoviceById(@PathVariable Long id){
        Optional<Invoice> invoice = invoiceRepository.findById(id);
        if(invoice.isPresent()){
            return  ResponseEntity.ok(invoice.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<Invoice> newInvoice(@RequestBody Invoice invoice){
        Invoice savedInvoice = invoiceRepository.save(invoice);
        return ResponseEntity.ok(savedInvoice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Invoice> modifyInvoiceById(@PathVariable Long id, @RequestBody Invoice invoice){
        Optional<Invoice> oldInvoice = invoiceRepository.findById(id);
        if(oldInvoice.isPresent()){
            invoice.setId(id);
            return ResponseEntity.ok(invoiceRepository.save(invoice));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteById(@PathVariable Long id){
        Optional<Invoice> oldInvoice = invoiceRepository.findById(id);
        if(oldInvoice.isPresent()){
            invoiceRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/invoice_items")
    public ResponseEntity<Iterable<InvoiceItem>> getAllInvoiceItemsById(@PathVariable Long id) {
        Optional<Invoice> oldInvoice = invoiceRepository.findById(id);
        if (oldInvoice.isPresent()) {
            return ResponseEntity.ok(oldInvoice.get().getInvoiceItems());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/invoice_items")
    public ResponseEntity<InvoiceItem> insertInvocieItemIntoInvocieById(@PathVariable Long id, @RequestBody InvoiceItem invoiceItem) {
        Optional<Invoice> oldInvoice = invoiceRepository.findById(id);
        if (oldInvoice.isPresent()) {
            Invoice invoice = oldInvoice.get();
            invoiceItem.setInvoice(invoice); // have to trigger from the @JoinTable side
            return ResponseEntity.ok(invoiceItemRepository.save(invoiceItem));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/closedInvoices")
    public ResponseEntity<Iterable<Invoice>> getAllClosedInvoices(){
        List<Invoice> invoices = invoiceRepository.findClosedInvoices();
        return ResponseEntity.ok(invoices);
    }
}
