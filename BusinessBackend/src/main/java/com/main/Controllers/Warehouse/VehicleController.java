package com.main.Controllers.Warehouse;

import com.main.Entites.User.Employee;
import com.main.Entites.Warehouse.Vehicle;
import com.main.Repositories.Warehouse.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @GetMapping("")
    public ResponseEntity<Iterable<Vehicle>> getAll(){
        return ResponseEntity.ok(vehicleRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> findById(@PathVariable Long id){
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        if(vehicle.isPresent()){
            return ResponseEntity.ok(vehicle.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<Vehicle> newVehicle(@RequestBody Vehicle vehicle) {
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return ResponseEntity.ok(savedVehicle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> modifyById(@RequestBody Vehicle vehicle, @PathVariable Long id) {
        Optional<Vehicle> oldVehicle = vehicleRepository.findById(id);
        if (oldVehicle.isPresent()) {
            vehicle.setId(id);
            return ResponseEntity.ok(vehicleRepository.save(vehicle));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteById(@PathVariable Long id) {
        Optional<Vehicle> oldVehicle = vehicleRepository.findById(id);
        if (oldVehicle.isPresent()) {
            vehicleRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/freeVehicles")
    public ResponseEntity<Iterable<Vehicle>> getFreeVehicles(){
        List<Vehicle> vehicles = vehicleRepository.getFreeVehicles();
        if(vehicles.isEmpty()){
            return null;
        }else{
            return ResponseEntity.ok(vehicles);
        }
    }

    @PutMapping("/{id}/unbind")
    public ResponseEntity<Vehicle> unbindVehicleFromWarehouse(@PathVariable Long id){
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        if(vehicle.isPresent()){
            vehicle.get().setWarehouse(null);
            return ResponseEntity.ok(vehicleRepository.save(vehicle.get()));
        }else{
            return ResponseEntity.notFound().build();
        }
    }
}
