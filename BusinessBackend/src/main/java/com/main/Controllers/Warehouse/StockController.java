package com.main.Controllers.Warehouse;

import com.main.Entites.Warehouse.Stock;
import com.main.Repositories.Warehouse.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/stocks")
public class StockController {

    @Autowired
    private StockRepository stockRepository;

    @GetMapping("")
    public ResponseEntity<Iterable<Stock>> getAll(){
        return ResponseEntity.ok(stockRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Stock> getStockById(@PathVariable Long id){
        Optional<Stock> stock = stockRepository.findById(id);
        if(stock.isPresent()){
            return ResponseEntity.ok(stock.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<Stock> newStock(@RequestBody Stock stock){
        Stock savedStock = stockRepository.save(stock);
        return ResponseEntity.ok(savedStock);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Stock> modifyStockById(@PathVariable Long id, @RequestBody Stock stock){
        Optional<Stock> oldStock = stockRepository.findById(id);
        if(oldStock.isPresent()){
            stock.setId(id);
            return ResponseEntity.ok(stockRepository.save(stock));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteById(@PathVariable Long id){
        Optional<Stock> oldStock = stockRepository.findById(id);
        if(oldStock.isPresent()){
            stockRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }
}
