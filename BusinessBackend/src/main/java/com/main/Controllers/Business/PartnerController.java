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
}
