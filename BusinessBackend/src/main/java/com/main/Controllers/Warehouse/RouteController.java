package com.main.Controllers.Warehouse;

import com.main.Entites.Warehouse.Route;
import com.main.Repositories.Warehouse.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/routes")
public class RouteController {

    @Autowired
    private RouteRepository routeRepository;

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
            return ResponseEntity.ok(routeRepository.save(route));
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
}
