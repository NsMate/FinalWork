package com.main.BusinessTests.BusinessOrderTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.main.Controllers.Business.BusinessOrderController;
import com.main.Entites.Business.BusinessOrder;
import com.main.Entites.Business.OrderItem;
import com.main.Entites.Business.Partner;
import com.main.Repositories.Business.BusinessOrderRepository;
import com.main.Repositories.Business.OrderItemRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
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

@WebMvcTest(BusinessOrderController.class)
@RunWith(SpringRunner.class)
public class BusinessOrderControllerTest {

    @Autowired
    MockMvc mvc;

    private ObjectMapper mapper = new ObjectMapper();

    @MockBean
    private BusinessOrderRepository businessOrderRepository;
    @MockBean
    private OrderItemRepository orderItemRepository;

    public BusinessOrder createBusinessOrder(){
        BusinessOrder order = new BusinessOrder();
        order.setIssueDate(Date.valueOf("2020-03-12"));
        order.setDueDate(Date.valueOf("2020-03-13"));
        order.setPartner(new Partner());
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

    @Test
    public void getAllOrderEndpointTest() throws Exception {
        BusinessOrder order = createBusinessOrder();
        order.setId(1L);
        BusinessOrder order1 = createBusinessOrder();
        order1.setId(2L);

        List<BusinessOrder> orders = new ArrayList<>();
        orders.add(order);
        orders.add(order1);

        Mockito.when(businessOrderRepository.findAll()).thenReturn(orders);

        mvc.perform(get("/business_orders")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andReturn();

        Mockito.verify(businessOrderRepository,Mockito.times(1)).findAll();
    }

    @Test
    public void getSpecificOrderEndpointTest() throws Exception {
        BusinessOrder order = createBusinessOrder();
        order.setId(1L);

        Mockito.when(businessOrderRepository.findById(1L)).thenReturn(Optional.of(order));

        mvc.perform(get("/business_orders/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andReturn();

        Mockito.verify(businessOrderRepository,Mockito.times(1)).findById(1L);
    }

    @Test
    public void postOrderEndpointTest() throws Exception {
        BusinessOrder order = createBusinessOrder();
        order.setId(1L);

        Mockito.when(businessOrderRepository.save(order)).thenReturn(order);

        mvc.perform(post("/business_orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(order)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andReturn();

        Mockito.verify(businessOrderRepository,Mockito.times(1)).save(order);
    }

    @Test
    public void putOrderEndpointTest() throws Exception {
        BusinessOrder order = createBusinessOrder();
        order.setId(1L);

        Mockito.when(businessOrderRepository.findById(1L)).thenReturn(Optional.of(order));
        Mockito.when(businessOrderRepository.save(order)).thenReturn(order);

        mvc.perform(put("/business_orders/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(order)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andReturn();

        Mockito.verify(businessOrderRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(businessOrderRepository,Mockito.times(1)).save(order);
    }

    @Test
    public void deleteOrderEndpointTest() throws Exception{
        BusinessOrder order = createBusinessOrder();
        order.setId(1L);

        Mockito.when(businessOrderRepository.findById(1L)).thenReturn(Optional.of(order));

        mvc.perform(delete("/business_orders/1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());

        Mockito.verify(businessOrderRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(businessOrderRepository,Mockito.times(1)).deleteById(1L);
    }

    @Test
    public void getAllClosedOrderEndpointTest() throws Exception {
        BusinessOrder order = createBusinessOrder();
        order.setId(1L);
        order.setStatus("CLOSED");
        BusinessOrder order1 = createBusinessOrder();
        order1.setId(2L);
        order1.setStatus("CLOSED");

        List<BusinessOrder> orders = new ArrayList<>();
        orders.add(order);
        orders.add(order1);

        Mockito.when(businessOrderRepository.findAllClosedOrders()).thenReturn(orders);

        mvc.perform(get("/business_orders/closedOrders")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].status").value("CLOSED"))
                .andExpect(jsonPath("$[1].status").value("CLOSED"))
                .andReturn();

        Mockito.verify(businessOrderRepository,Mockito.times(1)).findAllClosedOrders();
    }

    @Test
    public void getOrdersItemsEndpointTest() throws Exception {
        BusinessOrder order = createBusinessOrder();
        order.setId(1L);

        OrderItem item1 = createOrderItem(order);
        item1.setProduct("Item1");
        OrderItem item2 = createOrderItem(order);
        item2.setProduct("Item2");

        Mockito.when(businessOrderRepository.findById(1L)).thenReturn(Optional.of(order));

        mvc.perform(get("/business_orders/1/order_items")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        Mockito.verify(businessOrderRepository,Mockito.times(1)).findById(1L);
    }
}
