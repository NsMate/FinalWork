package com.main.BusinessTests.ProductTest;

import com.main.Entites.Business.Product;
import com.main.Entites.Business.ProductGroup;
import com.main.Repositories.Business.ProductGroupRepository;
import com.main.Repositories.Business.ProductRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.Optional;

@RunWith(SpringRunner.class)
@DataJpaTest
@ActiveProfiles("test")
public class ProductRepositoryTest {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductGroupRepository productGroupRepository;

    public ProductGroup createProductGroup(){
        ProductGroup productGroup = new ProductGroup();
        productGroup.setGroupName("Test");
        return productGroupRepository.save(productGroup);
    }
    public Product createProduct(ProductGroup pr, String name, int code){
        Product product = new Product();
        product.setProductName(name);
        product.setCode(code);
        product.setPrice(100);
        product.setProductGroup(pr);
        return productRepository.save(product);
    }

    @Test
    public void findProductByNameInDb(){
        ProductGroup pr1 = createProductGroup();
        Product product = createProduct(pr1,"TestProd",1000);

        Optional<Product> foundProd = productRepository.findByProductName("TestProd");

        Assert.assertTrue(foundProd.isPresent());
        Assert.assertEquals("TestProd",foundProd.get().getProductName());
    }
    @Test
    public void findProductByCodeInDb(){
        ProductGroup pr1 = createProductGroup();
        Product product = createProduct(pr1,"TestProd",1100);

        Optional<Product> foundProd = productRepository.findByCode(1100);
        Optional<Product> notFoundProd = productRepository.findByCode(2000);

        Assert.assertTrue(foundProd.isPresent());
        Assert.assertEquals(1100,foundProd.get().getCode());
        Assert.assertFalse(notFoundProd.isPresent());
    }

    @Test
    public void findProductByStringLiteral(){
        productGroupRepository.deleteAll();
        productRepository.deleteAll();
        ProductGroup pr1 = createProductGroup();
        Product product = createProduct(pr1,"TestProd",1100);
        Product product1 = createProduct(pr1,"Test",1101);

        List<Product> founds = productRepository.findProductThatMatchesInput("Test");

        Assert.assertEquals(2,founds.size());

        List<Product> founds2 = productRepository.findProductThatMatchesInput("TestProd");

        Assert.assertEquals(1,founds2.size());
    }


}
