package com.main.Controllers.Business;

import com.main.Entites.Business.Partner;
import com.main.Entites.Business.Product;
import com.main.Repositories.Business.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("")
    public ResponseEntity<Iterable<Product>> getAll(){
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> findProductById(@PathVariable Long id){
        Optional<Product> product = productRepository.findById(id);
        if(product.isPresent()){
            return ResponseEntity.ok(product.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<Product> newProduct(@RequestBody Product product){
        Product newProduct = productRepository.save(product);
        return ResponseEntity.ok(newProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> modifyProductById(@PathVariable Long id, @RequestBody Product product){
        Optional<Product> oldProduct = productRepository.findById(id);
        if(oldProduct.isPresent()){
            product.setId(id);
            Product newProduct = productRepository.save(product);
            return ResponseEntity.ok(newProduct);
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteProductById(@PathVariable Long id){
        Optional<Product> oldProduct = productRepository.findById(id);
        if(oldProduct.isPresent()){
            productRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/byCode/{code}")
    public ResponseEntity<Product> findProductByCode(@PathVariable Integer code){
        Optional<Product> product = productRepository.findByCode(code);
        if(product.isPresent()){
            return ResponseEntity.ok(product.get());
        }else{
            return null;
        }
    }

    @GetMapping("/input/{input}")
    public ResponseEntity<Iterable<Product>> findProductsByInput(@PathVariable String input){
        List<Product> foundProducts = productRepository.findProductThatMatchesInput(input);
        if(foundProducts.isEmpty()){
            return null;
        }else{
            return ResponseEntity.ok(foundProducts);
        }
    }
}
