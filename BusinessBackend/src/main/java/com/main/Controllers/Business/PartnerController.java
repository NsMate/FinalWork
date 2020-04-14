package com.main.Controllers.Business;

import com.main.Entites.Business.BusinessOrder;
import com.main.Entites.Business.Invoice;
import com.main.Entites.Business.Partner;
import com.main.Repositories.Business.BusinessOrderRepository;
import com.main.Repositories.Business.InvoiceRepository;
import com.main.Repositories.Business.PartnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Part;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/partners")
public class PartnerController {

    @Autowired
    private PartnerRepository partnerRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private BusinessOrderRepository businessOrderRepository;

    @GetMapping("")
    public ResponseEntity<Iterable<Partner>> getAll(){
        return ResponseEntity.ok(partnerRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Partner> getParnterById(@PathVariable Long id){
        Optional<Partner> partner = partnerRepository.findById(id);
        if(partner.isPresent()){
            return ResponseEntity.ok(partner.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<Partner> newPartner(@RequestBody Partner partner){
        Partner savedPartner = partnerRepository.save(partner);
        return ResponseEntity.ok(savedPartner);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Partner> modifyPartnerById(@PathVariable Long id, @RequestBody Partner partner){
        Optional<Partner> oldPartner = partnerRepository.findById(id);
        if(oldPartner.isPresent()){
            partner.setId(id);
            return ResponseEntity.ok(partnerRepository.save(partner));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteParnterById(@PathVariable Long id){
        Optional<Partner> oldPartner = partnerRepository.findById(id);
        if(oldPartner.isPresent()){
            partnerRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/invoices")
    public ResponseEntity<Iterable<Invoice>> getAllInvoiceById(@PathVariable Long id) {
        Optional<Partner> partner = partnerRepository.findById(id);
        if (partner.isPresent()) {
            return ResponseEntity.ok(partner.get().getInvoices());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/invoices")
    public ResponseEntity<Invoice> insertInvoicesToPartnerById(@PathVariable Long id, @RequestBody Invoice invoice) {
        Optional<Partner> foundPartner = partnerRepository.findById(id);
        if (foundPartner.isPresent()) {
            Partner partner = foundPartner.get();
            Invoice newInvoice = invoiceRepository.save(invoice);
            partner.getInvoices().add(invoice);
            invoiceRepository.save(invoice);  // have to trigger from the @JoinTable side
            return ResponseEntity.ok(newInvoice);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/invoices")
    public ResponseEntity<Iterable<Invoice>> modifyInvocieItemOnPartnerById(@PathVariable Long id, @RequestBody List<Invoice> invoices) {
        Optional<Partner> oldPartner = partnerRepository.findById(id);
        if (oldPartner.isPresent()) {
            Partner partner = oldPartner.get();

            for (Invoice invoice : invoices) {
                if (invoice.getId() == null) {
                    invoiceRepository.save(invoice);
                }
            }

            partner.setInvoices(invoices);
            partnerRepository.save(partner);
            return ResponseEntity.ok(invoices);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<Iterable<BusinessOrder>> getAllOrdersById(@PathVariable Long id) {
        Optional<Partner> partner = partnerRepository.findById(id);
        if (partner.isPresent()) {
            return ResponseEntity.ok(partner.get().getBusinessOrders());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/orders")
    public ResponseEntity<BusinessOrder> insertOrdersToPartnerById(@PathVariable Long id, @RequestBody BusinessOrder businessOrder) {
        Optional<Partner> foundPartner = partnerRepository.findById(id);
        if (foundPartner.isPresent()) {
            Partner partner = foundPartner.get();
            BusinessOrder newOrder = businessOrderRepository.save(businessOrder);
            partner.getBusinessOrders().add(businessOrder);
            businessOrderRepository.save(businessOrder);  // have to trigger from the @JoinTable side
            return ResponseEntity.ok(newOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/orders")
    public ResponseEntity<Iterable<BusinessOrder>> modifyOrderOnPartnerById(@PathVariable Long id, @RequestBody List<BusinessOrder> businessOrders) {
        Optional<Partner> oldPartner = partnerRepository.findById(id);
        if (oldPartner.isPresent()) {
            Partner partner = oldPartner.get();

            for (BusinessOrder businessOrder : businessOrders) {
                if (businessOrder.getId() == null) {
                    businessOrderRepository.save(businessOrder);
                }
            }

            partner.setBusinessOrders(businessOrders);
            partnerRepository.save(partner);
            return ResponseEntity.ok(businessOrders);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/input/{input}")
    public ResponseEntity<Iterable<Partner>> findPartnersByInput(@PathVariable String input){
        List<Partner> foundPartners = partnerRepository.findPartnerThatMatchersInput(input);
        if(foundPartners.isEmpty()){
            return null;
        }else{
            return ResponseEntity.ok(foundPartners);
        }
    }

    @GetMapping("/own")
    public ResponseEntity<Partner> findOwnCompany(){
        Optional<Partner> ownCompany = partnerRepository.findByOwn(1);
        if(ownCompany.isPresent()){
            return ResponseEntity.ok(ownCompany.get());
        }else{
            return null;
        }
    }

    @GetMapping("/outsidePartners")
    public ResponseEntity<Iterable<Partner>> getOutsidePartners(){
        List<Partner> partners = partnerRepository.findAllOutsidePartners();
        if(partners.isEmpty()){
            return null;
        }else{
            return ResponseEntity.ok(partners);
        }
    }
}
