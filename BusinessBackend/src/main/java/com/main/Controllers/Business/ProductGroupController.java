package com.main.Controllers.Business;

import com.main.Entites.Business.Product;
import com.main.Entites.Business.ProductGroup;
import com.main.Repositories.Business.ProductGroupRepository;
import com.main.Repositories.Business.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/product_groups")
public class ProductGroupController {

    @Autowired
    private ProductGroupRepository productGroupRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("")
    public ResponseEntity<Iterable<ProductGroup>> getAll(){
        return ResponseEntity.ok(productGroupRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductGroup> findProductById(@PathVariable Long id){
        Optional<ProductGroup> productGroup = productGroupRepository.findById(id);
        if(productGroup.isPresent()){
            return ResponseEntity.ok(productGroup.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<ProductGroup> newProduct(@RequestBody ProductGroup productGroup){
        ProductGroup newProductGroup = productGroupRepository.save(productGroup);
        return ResponseEntity.ok(newProductGroup);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductGroup> modifyProductById(@PathVariable Long id, @RequestBody ProductGroup productGroup){
        Optional<ProductGroup> oldProductGroup = productGroupRepository.findById(id);
        if(oldProductGroup.isPresent()){
            productGroup.setId(id);
            ProductGroup newProductGroup = productGroupRepository.save(productGroup);
            return ResponseEntity.ok(newProductGroup);
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteProductById(@PathVariable Long id){
        Optional<ProductGroup> oldProductGroup = productGroupRepository.findById(id);
        if(oldProductGroup.isPresent()){
            productGroupRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<Iterable<Product>> getAllProductsInGroup(@PathVariable Long id) {
        Optional<ProductGroup> productGroup = productGroupRepository.findById(id);
        if (productGroup.isPresent()) {
            return ResponseEntity.ok(productGroup.get().getProductList());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/products")
    public ResponseEntity<Product> insertProductIntoGroupById(@PathVariable Long id, @RequestBody Product product) {
        Optional<ProductGroup> oldProductGroup = productGroupRepository.findById(id);
        if (oldProductGroup.isPresent()) {
            ProductGroup productGroup = oldProductGroup.get();
            product.setProductGroup(productGroup);
            Product newProduct = productRepository.save(product);
            return ResponseEntity.ok(newProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/products")
    public ResponseEntity<Iterable<Product>> modifyProductInGroupById(@PathVariable Long id, @RequestBody List<Product> products) {
        Optional<ProductGroup> oldProductGroup = productGroupRepository.findById(id);
        if (oldProductGroup.isPresent()) {
            ProductGroup productGroup = oldProductGroup.get();

            for (Product product : products) {
                if (product.getId() == null) {
                    product.setProductGroup(productGroup);
                    productRepository.save(product);
                }
            }

            productGroup.setProductList(products);
            productGroupRepository.save(productGroup);
            return ResponseEntity.ok(products);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
