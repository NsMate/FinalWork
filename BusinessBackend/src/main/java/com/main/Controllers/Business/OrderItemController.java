package com.main.Controllers.Business;

import com.main.Entites.Business.OrderItem;
import com.main.Repositories.Business.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/order_items")
public class OrderItemController {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @GetMapping("")
    public ResponseEntity<Iterable<OrderItem>> getAll(){
        return ResponseEntity.ok(orderItemRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderItem> findOrderItemById(@PathVariable Long id){
        Optional<OrderItem> orderItem = orderItemRepository.findById(id);
        if(orderItem.isPresent()){
            return ResponseEntity.ok(orderItem.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<OrderItem> newOrderItem(@RequestBody OrderItem orderItem){
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);
        return ResponseEntity.ok(savedOrderItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderItem> modifyOrderItemById(@PathVariable Long id, @RequestBody OrderItem orderItem){
        Optional<OrderItem> oldOrderItem = orderItemRepository.findById(id);
        if(oldOrderItem.isPresent()){
            orderItem.setId(id);
            return ResponseEntity.ok(orderItemRepository.save(orderItem));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteOrderItemById(@PathVariable Long id){
        Optional<OrderItem> oldOrderItem = orderItemRepository.findById(id);
        if(oldOrderItem.isPresent()){
            orderItemRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }
}
