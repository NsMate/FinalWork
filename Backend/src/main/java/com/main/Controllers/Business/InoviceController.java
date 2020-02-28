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
            InvoiceItem newInvoiceItem = invoiceItemRepository.save(invoiceItem);
            invoice.getInvoiceItems().add(newInvoiceItem);
            invoiceItemRepository.save(invoiceItem);  // have to trigger from the @JoinTable side
            return ResponseEntity.ok(newInvoiceItem);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/invoice_items")
    public ResponseEntity<Iterable<InvoiceItem>> modifyInvocieItemOnInoviceById(@PathVariable Long id, @RequestBody List<InvoiceItem> invoiceItems) {
        Optional<Invoice> oldInvoice = invoiceRepository.findById(id);
        if (oldInvoice.isPresent()) {
            Invoice invoice = oldInvoice.get();

            for (InvoiceItem invoiceItem : invoiceItems) {
                if (invoiceItem.getId() == null) {
                    invoiceItemRepository.save(invoiceItem);
                }
            }

            invoice.setInvoiceItems(invoiceItems);
            invoiceRepository.save(invoice);
            return ResponseEntity.ok(invoiceItems);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
