package com.main.Controllers.Business;

import com.main.Entites.Business.BusinessOrder;
import com.main.Entites.Business.OrderItem;
import com.main.Repositories.Business.BusinessOrderRepository;
import com.main.Repositories.Business.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("business_orders")
public class BusinessOrderController {

    @Autowired
    private BusinessOrderRepository businessOrderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @GetMapping("")
    public ResponseEntity<Iterable<BusinessOrder>> getAll(){
        return ResponseEntity.ok(businessOrderRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusinessOrder> getBusinessOrderById(@PathVariable Long id){
        Optional<BusinessOrder> businessOrder = businessOrderRepository.findById(id);
        if(businessOrder.isPresent()){
            return ResponseEntity.ok(businessOrder.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<BusinessOrder> newBusinessOrder(@RequestBody BusinessOrder businessOrder){
        BusinessOrder savedBusinessOrder = businessOrderRepository.save(businessOrder);
        return ResponseEntity.ok(savedBusinessOrder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BusinessOrder> modifyBusinessOrderById(@PathVariable Long id, @RequestBody BusinessOrder businessOrder){
        Optional<BusinessOrder> oldBusinessOrder = businessOrderRepository.findById(id);
        if(oldBusinessOrder.isPresent()){
            businessOrder.setId(id);
            return ResponseEntity.ok(businessOrderRepository.save(businessOrder));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteBusinessOrderById(@PathVariable Long id){
        Optional<BusinessOrder> oldBusinessOrder = businessOrderRepository.findById(id);
        if(oldBusinessOrder.isPresent()){
            businessOrderRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/order_items")
    public ResponseEntity<Iterable<OrderItem>> getAllOrderItemsById(@PathVariable Long id) {
        Optional<BusinessOrder> oldBusinesssOrder = businessOrderRepository.findById(id);
        if (oldBusinesssOrder.isPresent()) {
            return ResponseEntity.ok(oldBusinesssOrder.get().getOrderItemList());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/order_items")
    public ResponseEntity<OrderItem> insertOrderItemIntoBusinessOrderById(@PathVariable Long id, @RequestBody OrderItem orderItem) {
        Optional<BusinessOrder> oldBusinessOrder = businessOrderRepository.findById(id);
        if (oldBusinessOrder.isPresent()) {
            BusinessOrder businessOrder = oldBusinessOrder.get();
            OrderItem newOrderItem = orderItemRepository.save(orderItem);
            businessOrder.getOrderItemList().add(newOrderItem);
            orderItemRepository.save(orderItem);  // have to trigger from the @JoinTable side
            return ResponseEntity.ok(newOrderItem);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/order_items")
    public ResponseEntity<Iterable<OrderItem>> modifyOrderItemOnOrderById(@PathVariable Long id, @RequestBody List<OrderItem> orderItems) {
        Optional<BusinessOrder> oldBusinessOrder = businessOrderRepository.findById(id);
        if (oldBusinessOrder.isPresent()) {
            BusinessOrder businessOrder = oldBusinessOrder.get();

            for (OrderItem orderItem : orderItems) {
                if (orderItem.getId() == null) {
                    orderItemRepository.save(orderItem);
                }
            }

            businessOrder.setOrderItemList(orderItems);
            businessOrderRepository.save(businessOrder);
            return ResponseEntity.ok(orderItems);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
