package com.main.BusinessTests.OrderItemTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.main.Controllers.Business.OrderItemController;
import com.main.Entites.Business.*;
import com.main.Entites.User.AppUser;
import com.main.Entites.User.Employee;
import com.main.Repositories.Business.OrderItemRepository;
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

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderItemController.class)
@RunWith(SpringRunner.class)
public class OrderItemControllerTest {

    @Autowired
    MockMvc mvc;

    private ObjectMapper mapper = new ObjectMapper();

    @MockBean
    private OrderItemRepository orderItemRepository;

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
    public Partner createPartner(){
        Partner partner = new Partner();
        partner.setCity("Budapest");
        partner.setContactEmail("test@test");
        partner.setContactFirstName("Nagy");
        partner.setContactLastName("Test");
        partner.setContactPhoneNumber("+361111112");
        partner.setPartnerName("Test Company");
        partner.setStreet("Test Strett");
        partner.setZipCode(1111);
        partner.setOwn(0);
        partner.setStreetNumber(12);
        return partner;
    }
    public BusinessOrder createBusinessOrder(Partner partner){
        BusinessOrder order = new BusinessOrder();
        order.setIssueDate(Date.valueOf("2020-03-12"));
        order.setDueDate(Date.valueOf("2020-03-13"));
        order.setPartner(partner);
        order.setPaymentType("Átutalás");
        order.setVat("27");
        order.setStatus("OPEN");
        return order;
    }
    public OrderItem createOrderItem(BusinessOrder businessOrder){
        OrderItem oi = new OrderItem();
        oi.setBusinessOrder(businessOrder);
        oi.setProduct("Test");
        oi.setPrice("1000");
        oi.setQuantity(10);
        oi.setUnit("db");
        return oi;
    }

    @Before
    public void before(){
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getAllOrderItemEndpointTest() throws Exception {
        Partner partner = createPartner();
        BusinessOrder order = createBusinessOrder(partner);
        OrderItem orderItem1 = createOrderItem(order);
        orderItem1.setProduct("test1");
        OrderItem orderItem2 = createOrderItem(order);
        orderItem2.setProduct("test2");
        List<OrderItem> items = new ArrayList<>();
        items.add(orderItem1);
        items.add(orderItem2);

        Mockito.when(orderItemRepository.findAll()).thenReturn(items);

        mvc.perform(get("/order_items")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].product").value("test1"))
                .andExpect(jsonPath("$[1].product").value("test2"))
                .andReturn();

        Mockito.verify(orderItemRepository,Mockito.times(1)).findAll();
    }

    @Test
    public void getOrderItemByIdEndpointTest() throws Exception {
        Partner partner = createPartner();
        BusinessOrder order = createBusinessOrder(partner);
        OrderItem orderItem1 = createOrderItem(order);
        orderItem1.setId(1L);
        orderItem1.setProduct("test1");

        Mockito.when(orderItemRepository.findById(1L)).thenReturn(Optional.of(orderItem1));

        mvc.perform(get("/order_items/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.product").value("test1"))
                .andReturn();

        Mockito.verify(orderItemRepository,Mockito.times(1)).findById(1L);
    }

    @Test
    public void postOderItemEndpointTest() throws Exception {
        Partner partner = createPartner();
        BusinessOrder order = createBusinessOrder(partner);
        OrderItem orderItem1 = createOrderItem(order);
        orderItem1.setId(1L);
        orderItem1.setProduct("test1");

        Mockito.when(orderItemRepository.save(orderItem1)).thenReturn(orderItem1);

        mvc.perform(post("/order_items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(orderItem1)))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    public void putOderItemByIdEndpointTest() throws Exception {
        Partner partner = createPartner();
        BusinessOrder order = createBusinessOrder(partner);
        OrderItem orderItem1 = createOrderItem(order);
        orderItem1.setId(1L);
        orderItem1.setProduct("test1");

        Mockito.when(orderItemRepository.findById(1L)).thenReturn(Optional.of(orderItem1));
        Mockito.when(orderItemRepository.save(orderItem1)).thenReturn(orderItem1);

        mvc.perform(put("/order_items/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(orderItem1)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.product").value("test1"))
                .andReturn();

        Mockito.verify(orderItemRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(orderItemRepository,Mockito.times(1)).save(orderItem1);
    }

    @Test
    public void deleteOrderItemEndpointTest() throws Exception{
        Partner partner = createPartner();
        BusinessOrder order = createBusinessOrder(partner);
        OrderItem orderItem1 = createOrderItem(order);
        orderItem1.setId(1L);
        orderItem1.setProduct("test1");

        Mockito.when(orderItemRepository.findById(1L)).thenReturn(Optional.of(orderItem1));

        mvc.perform(delete("/order_items/1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());

        Mockito.verify(orderItemRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(orderItemRepository,Mockito.times(1)).deleteById(1L);
    }
}
