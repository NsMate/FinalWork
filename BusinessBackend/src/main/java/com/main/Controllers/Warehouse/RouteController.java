package com.main.Controllers.Warehouse;

import com.main.Entites.Warehouse.Route;
import com.main.Repositories.Warehouse.RouteRepository;
import com.main.Repositories.Warehouse.VehicleRepository;
import com.main.Repositories.Warehouse.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/routes")
public class RouteController {

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @GetMapping("")
    public ResponseEntity<Iterable<Route>> getAll(){
        return ResponseEntity.ok(routeRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Route> getRouteById(@PathVariable Long id){
        Optional<Route> route = routeRepository.findById(id);
        if(route.isPresent()){
            return ResponseEntity.ok(route.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<Route> newRoute(@RequestBody Route route){
        Route savedRoute = routeRepository.save(route);
        return ResponseEntity.ok(savedRoute);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Route> modifyRouteById(@PathVariable Long id, @RequestBody Route route){
        Optional<Route> oldRoute = routeRepository.findById(id);
        if(oldRoute.isPresent()){
            route.setId(id);
            Route savedRoute = routeRepository.save(route);
            return ResponseEntity.ok(savedRoute);
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteById(@PathVariable Long id){
        Optional<Route> oldRoute = routeRepository.findById(id);
        if(oldRoute.isPresent()){
            routeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/between/{date1}/{date2}")
    public ResponseEntity<Iterable<Route>> getRouteBetweenDate(@PathVariable String date1, @PathVariable String date2) throws ParseException {
        Date start = new SimpleDateFormat("yyyy-MM-dd").parse(date1);
        Date end = new SimpleDateFormat("yyyy-MM-dd").parse(date2);
        List<Route> routes = routeRepository.getRoutesBetweenDates(start,end);
        return ResponseEntity.ok(routes);
    }
}
