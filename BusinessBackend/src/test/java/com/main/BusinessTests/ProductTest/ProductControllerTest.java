package com.main.BusinessTests.ProductTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.main.Controllers.Business.ProductController;
import com.main.Entites.Business.Product;
import com.main.Entites.Business.ProductGroup;
import com.main.Entites.User.AppUser;
import com.main.Entites.User.Employee;
import com.main.Repositories.Business.ProductGroupRepository;
import com.main.Repositories.Business.ProductRepository;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(ProductController.class)
@RunWith(SpringRunner.class)
public class ProductControllerTest {

    @Autowired
    MockMvc mvc;

    private ObjectMapper mapper = new ObjectMapper();

    @MockBean
    private ProductGroupRepository productGroupRepository;

    @MockBean
    private ProductRepository productRepository;

    public ProductGroup createProductGroup(){
        ProductGroup productGroup = new ProductGroup();
        productGroup.setGroupName("Test");
        return productGroup;
    }
    public Product createProduct(ProductGroup pr){
        Product product = new Product();
        product.setProductName("TestProduct");
        product.setCode(1000);
        product.setPrice(100);
        product.setProductGroup(pr);
        return product;
    }

    @Before
    public void before(){
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getAllProductsEndpointTest() throws Exception {
        ProductGroup pr1 = createProductGroup();
        Product product = createProduct(pr1);
        product.setProductName("Test1");
        Product product1 = createProduct(pr1);
        product1.setProductName("Test2");

        List<Product> products = new ArrayList<>();
        products.add(product);
        products.add(product1);

        Mockito.when(productRepository.findAll()).thenReturn(products);

        mvc.perform(get("/products")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].productName").value("Test1"))
                .andExpect(jsonPath("$[1].productName").value("Test2"))
                .andReturn();

        Mockito.verify(productRepository,Mockito.times(1)).findAll();

    }

    @Test
    public void getSpecifiedProductsEndpointTest() throws Exception {
        ProductGroup pr1 = createProductGroup();
        Product product = createProduct(pr1);
        product.setProductName("Test1");
        product.setId(1L);

        Mockito.when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        mvc.perform(get("/products/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.productName").value("Test1"))
                .andReturn();

        Mockito.verify(productRepository,Mockito.times(1)).findById(1L);

    }

    @Test
    public void postProductEndpointTest() throws Exception {
        ProductGroup pr1 = createProductGroup();
        Product product = createProduct(pr1);
        product.setProductName("Test1");
        product.setId(1L);

        Mockito.when(productRepository.save(product)).thenReturn(product);

        mvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(product)))
                .andExpect(status().isOk())
                .andReturn();

    }

    @Test
    public void putProductEndpointTest() throws Exception {
        ProductGroup pr1 = createProductGroup();
        Product product = createProduct(pr1);
        product.setProductName("Test1");
        product.setId(1L);

        Mockito.when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        Mockito.when(productRepository.save(product)).thenReturn(product);

        mvc.perform(put("/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(product)))
                .andExpect(status().isOk())
                .andReturn();

    }

    @Test
    public void deleteProductEndpointTest() throws Exception{
        ProductGroup pr1 = createProductGroup();
        Product product = createProduct(pr1);
        product.setProductName("Test1");
        product.setId(1L);

        Mockito.when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        mvc.perform(delete("/products/1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());

        Mockito.verify(productRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(productRepository,Mockito.times(1)).deleteById(1L);
    }

    @Test
    public void getProductByInputStringEndpointTest() throws Exception {
        ProductGroup pr1 = createProductGroup();
        Product product = createProduct(pr1);
        product.setProductName("Test1");
        product.setId(1L);
        Product product1 = createProduct(pr1);
        product.setProductName("Test2");
        product.setId(2L);

        List<Product> productsFound = new ArrayList<>();
        productsFound.add(product);
        productsFound.add(product1);

        Mockito.when(productRepository.findProductThatMatchesInput("Test")).thenReturn(productsFound);

        mvc.perform(get("/products/input/Test")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn();

        Mockito.verify(productRepository,Mockito.times(1)).findProductThatMatchesInput("Test");

    }

    @Test
    public void getProductByCodeEndpointTest() throws Exception {
        ProductGroup pr1 = createProductGroup();
        Product product = createProduct(pr1);
        product.setProductName("Test1");
        product.setCode(1001);
        product.setId(1L);

        Mockito.when(productRepository.findByCode(1001)).thenReturn(Optional.of(product));

        mvc.perform(get("/products/byCode/1001")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.productName").value("Test1"))
                .andReturn();

        Mockito.verify(productRepository,Mockito.times(1)).findByCode(1001);
    }

    @Test
    public void getProductByNameEndpointTest() throws Exception {
        ProductGroup pr1 = createProductGroup();
        Product product = createProduct(pr1);
        product.setProductName("Test1");
        product.setCode(1001);
        product.setId(1L);

        Mockito.when(productRepository.findByProductName("Test1")).thenReturn(Optional.of(product));

        mvc.perform(get("/products/byname/Test1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.productName").value("Test1"))
                .andReturn();

        Mockito.verify(productRepository,Mockito.times(1)).findByProductName("Test1");
    }

}
