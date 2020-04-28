package com.main.Controllers.Warehouse;

import com.main.Entites.User.Employee;
import com.main.Entites.Warehouse.Route;
import com.main.Entites.Warehouse.Stock;
import com.main.Entites.Warehouse.Vehicle;
import com.main.Entites.Warehouse.Warehouse;
import com.main.Repositories.User.EmployeeRepository;
import com.main.Repositories.Warehouse.RouteRepository;
import com.main.Repositories.Warehouse.StockRepository;
import com.main.Repositories.Warehouse.VehicleRepository;
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

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

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
            Warehouse wh = oldWarehouse.get();
            for(Vehicle vehicle : wh.getVehicleList()){
                vehicle.setWarehouse(null);
                vehicleRepository.save(vehicle);
            }
            for(Employee emp : wh.getEmployeeList()){
                emp.setWarehouse(null);
                employeeRepository.save(emp);
            }

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

    @PostMapping("/{id}/stocks")
    public ResponseEntity<Stock> insertStockIntoWarehouseById(@PathVariable Long id, @RequestBody Stock stock) {
        Optional<Warehouse> oldWarehouse = warehouseRepository.findById(id);
        if (oldWarehouse.isPresent()) {
            Warehouse warehouse = oldWarehouse.get();
            stock.setWarehouse(warehouse);
            return ResponseEntity.ok(stockRepository.save(stock));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/vehicles")
    public ResponseEntity<Iterable<Vehicle>> getAllVehicleByIdInWarehouse(@PathVariable Long id) {
        Optional<Warehouse> warehouse = warehouseRepository.findById(id);
        if (warehouse.isPresent()) {
            return ResponseEntity.ok(warehouse.get().getVehicleList());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/vehicles")
    public ResponseEntity<Vehicle> insertVehicleIntoWarehouseById(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        Optional<Warehouse> oldWarehouse = warehouseRepository.findById(id);
        if (oldWarehouse.isPresent()) {
            Warehouse warehouse = oldWarehouse.get();
            vehicle.setWarehouse(warehouse);
            return ResponseEntity.ok(vehicleRepository.save(vehicle));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/employees")
    public ResponseEntity<Employee> insertVehicleIntoWarehouseById(@PathVariable Long id, @RequestBody Employee employee) {
        Optional<Warehouse> oldWarehouse = warehouseRepository.findById(id);
        if (oldWarehouse.isPresent()) {
            Warehouse warehouse = oldWarehouse.get();
            employee.setWarehouse(warehouse);
            return ResponseEntity.ok(employeeRepository.save(employee));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
