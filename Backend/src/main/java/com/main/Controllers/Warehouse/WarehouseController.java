package com.main.Controllers.Warehouse;

import com.main.Entites.Warehouse.Route;
import com.main.Entites.Warehouse.Stock;
import com.main.Entites.Warehouse.Warehouse;
import com.main.Repositories.Warehouse.RouteRepository;
import com.main.Repositories.Warehouse.StockRepository;
import com.main.Repositories.Warehouse.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/warehouses")
public class WarehouseController {

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private RouteRepository routeRepository;

    @GetMapping("")
    public ResponseEntity<Iterable<Warehouse>> getAll(){
        return ResponseEntity.ok(warehouseRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Warehouse> getWarehouseById(@PathVariable Long id){
        Optional<Warehouse> warehouse = warehouseRepository.findById(id);
        if(warehouse.isPresent()){
            return ResponseEntity.ok(warehouse.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<Warehouse> newWarehouse(@RequestBody Warehouse warehouse){
        Warehouse savedWarehouse = warehouseRepository.save(warehouse);
        return ResponseEntity.ok(savedWarehouse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Warehouse> modifyWarehouseById(@PathVariable Long id, @RequestBody Warehouse warehouse){
        Optional<Warehouse> oldWarehouse = warehouseRepository.findById(id);
        if(oldWarehouse.isPresent()){
            warehouse.setId(id);
            return ResponseEntity.ok(warehouseRepository.save(warehouse));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteById(@PathVariable Long id){
        Optional<Warehouse> oldWarehouse = warehouseRepository.findById(id);
        if(oldWarehouse.isPresent()){
            warehouseRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/routes")
    public ResponseEntity<Iterable<Route>> getAllRoutesById(@PathVariable Long id) {
        Optional<Warehouse> warehouse = warehouseRepository.findById(id);
        if (warehouse.isPresent()) {
            return ResponseEntity.ok(warehouse.get().getRouteList());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/routes")
    public ResponseEntity<Route> insertRouteIntoWarehouseById(@PathVariable Long id, @RequestBody Route route) {
        Optional<Warehouse> oldWarehouse = warehouseRepository.findById(id);
        if (oldWarehouse.isPresent()) {
            Warehouse warehouse = oldWarehouse.get();
            Route newRoute = routeRepository.save(route);
            warehouse.getRouteList().add(newRoute);
            routeRepository.save(route);  // have to trigger from the @JoinTable side
            return ResponseEntity.ok(newRoute);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/routes")
    public ResponseEntity<Iterable<Route>> modifyRouteInWarehouseById(@PathVariable Long id, @RequestBody List<Route> routes) {
        Optional<Warehouse> oldWarehouse = warehouseRepository.findById(id);
        if (oldWarehouse.isPresent()) {
            Warehouse warehouse = oldWarehouse.get();

            for (Route route : routes) {
                if (route.getId() == null) {
                    routeRepository.save(route);
                }
            }

            warehouse.setRouteList(routes);
            warehouseRepository.save(warehouse);
            return ResponseEntity.ok(routes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/stocks")
    public ResponseEntity<Iterable<Stock>> getAllStocksById(@PathVariable Long id) {
        Optional<Warehouse> warehouse = warehouseRepository.findById(id);
        if (warehouse.isPresent()) {
            return ResponseEntity.ok(warehouse.get().getStockList());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/stocks")
    public ResponseEntity<Stock> insertStockIntoWarehouseById(@PathVariable Long id, @RequestBody Stock stock) {
        Optional<Warehouse> oldWarehouse = warehouseRepository.findById(id);
        if (oldWarehouse.isPresent()) {
            Warehouse warehouse = oldWarehouse.get();
            Stock newStock = stockRepository.save(stock);
            warehouse.getStockList().add(newStock);
            stockRepository.save(stock);  // have to trigger from the @JoinTable side
            return ResponseEntity.ok(newStock);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/stocks")
    public ResponseEntity<Iterable<Stock>> modifyStockInWarehouseById(@PathVariable Long id, @RequestBody List<Stock> stocks) {
        Optional<Warehouse> oldWarehouse = warehouseRepository.findById(id);
        if (oldWarehouse.isPresent()) {
            Warehouse warehouse = oldWarehouse.get();

            for (Stock stock : stocks) {
                if (stock.getId() == null) {
                    stockRepository.save(stock);
                }
            }

            warehouse.setStockList(stocks);
            warehouseRepository.save(warehouse);
            return ResponseEntity.ok(stocks);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
