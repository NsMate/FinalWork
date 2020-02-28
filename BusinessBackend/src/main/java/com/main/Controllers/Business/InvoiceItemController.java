package com.main.Controllers.Business;

import com.main.Entites.Business.InvoiceItem;
import com.main.Repositories.Business.InvoiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/invoice_items")
public class InvoiceItemController {

    @Autowired
    private InvoiceItemRepository invoiceItemRepository;

    @GetMapping("")
    public ResponseEntity<Iterable<InvoiceItem>> getAll(){
        return ResponseEntity.ok(invoiceItemRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceItem> findInvoiceItemById(@PathVariable Long id){
        Optional<InvoiceItem> invoiceItem = invoiceItemRepository.findById(id);
        if(invoiceItem.isPresent()){
            return ResponseEntity.ok(invoiceItem.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<InvoiceItem> newInvoiceItem(@RequestBody InvoiceItem invoiceItem){
        InvoiceItem savedInvoiceItem = invoiceItemRepository.save(invoiceItem);
        return ResponseEntity.ok(savedInvoiceItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvoiceItem> modifyInoviceItemById(@PathVariable Long id, @RequestBody InvoiceItem invoiceItem){
        Optional<InvoiceItem> oldInvoiceItem = invoiceItemRepository.findById(id);
        if(oldInvoiceItem.isPresent()){
            invoiceItem.setId(id);
            return ResponseEntity.ok(invoiceItemRepository.save(invoiceItem));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteInvoiceItemById(@PathVariable Long id){
        Optional<InvoiceItem> oldInvoiceItem = invoiceItemRepository.findById(id);
        if(oldInvoiceItem.isPresent()){
            invoiceItemRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }
}
