package com.main.BusinessTests.ProductGroupTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.main.Controllers.Business.ProductGroupController;
import com.main.Entites.Business.*;
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

@WebMvcTest(ProductGroupController.class)
@RunWith(SpringRunner.class)
public class ProductGroupControllerTest {

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
    public Product createProduct(){
        Product product = new Product();
        product.setProductName("TestProduct");
        product.setCode(1000);
        product.setPrice(100);
        return product;
    }

    @Before
    public void before(){
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getAllProductGroupsEndpointTest() throws Exception {
        ProductGroup pr1 = createProductGroup();
        pr1.setGroupName("Test1");
        ProductGroup pr2 = createProductGroup();
        pr2.setGroupName("Test2");

        List<ProductGroup> groups = new ArrayList<>();
        groups.add(pr1);
        groups.add(pr2);

        Mockito.when(productGroupRepository.findAll()).thenReturn(groups);

        mvc.perform(get("/product_groups")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].groupName").value("Test1"))
                .andExpect(jsonPath("$[1].groupName").value("Test2"))
                .andReturn();

        Mockito.verify(productGroupRepository,Mockito.times(1)).findAll();

    }

    @Test
    public void getSpecificProductGroupsEndpointTest() throws Exception {
        ProductGroup pr1 = createProductGroup();
        pr1.setGroupName("Test1");
        pr1.setId(1L);

        Mockito.when(productGroupRepository.findById(1L)).thenReturn(Optional.of(pr1));

        mvc.perform(get("/product_groups/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.groupName").value("Test1"))
                .andReturn();

        Mockito.verify(productGroupRepository,Mockito.times(1)).findById(1L);

    }

    @Test
    public void postProductGroupsEndpointTest() throws Exception {
        ProductGroup pr1 = createProductGroup();
        pr1.setGroupName("Test1");
        pr1.setId(1L);

        Mockito.when(productGroupRepository.save(pr1)).thenReturn(pr1);

        mvc.perform(post("/product_groups")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(pr1)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.groupName").value("Test1"))
                .andReturn();

        Mockito.verify(productGroupRepository,Mockito.times(1)).save(pr1);
    }

    @Test
    public void putProductGroupsEndpointTest() throws Exception {
        ProductGroup pr1 = createProductGroup();
        pr1.setGroupName("Test1");
        pr1.setId(1L);

        Mockito.when(productGroupRepository.findById(1L)).thenReturn(Optional.of(pr1));
        Mockito.when(productGroupRepository.save(pr1)).thenReturn(pr1);

        mvc.perform(put("/product_groups/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(pr1)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.groupName").value("Test1"))
                .andReturn();

        Mockito.verify(productGroupRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(productGroupRepository,Mockito.times(1)).save(pr1);
    }

    @Test
    public void deleteProductGroupEndpointTest() throws Exception{
        ProductGroup pr1 = createProductGroup();
        pr1.setGroupName("Test1");
        pr1.setId(1L);

        Mockito.when(productGroupRepository.findById(1L)).thenReturn(Optional.of(pr1));

        mvc.perform(delete("/product_groups/1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());

        Mockito.verify(productGroupRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(productGroupRepository,Mockito.times(1)).deleteById(1L);
    }

    @Test
    public void postProductInProductGroupEndpointTest() throws Exception {
        ProductGroup pr1 = createProductGroup();
        pr1.setGroupName("Test1");
        pr1.setId(1L);
        Product product = createProduct();
        product.setProductName("TestProd");
        product.setProductGroup(pr1);
        product.setId(1L);

        Mockito.when(productGroupRepository.findById(1L)).thenReturn(Optional.of(pr1));
        Mockito.when(productRepository.save(product)).thenReturn(product);

        mvc.perform(post("/product_groups/1/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(product)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.productName").value("TestProd"))
                .andReturn();

        Mockito.verify(productGroupRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(productRepository,Mockito.times(1)).save(product);
    }


}
