package com.main.Controllers.Warehouse;

import com.main.Entites.Business.BusinessOrder;
import com.main.Entites.Business.Invoice;
import com.main.Entites.Warehouse.Route;
import com.main.Entites.Warehouse.Vehicle;
import com.main.Entites.Warehouse.Warehouse;
import com.main.Repositories.Business.BusinessOrderRepository;
import com.main.Repositories.Business.InvoiceRepository;
import com.main.Repositories.Warehouse.RouteRepository;
import com.main.Repositories.Warehouse.VehicleRepository;
import com.main.Repositories.Warehouse.WarehouseRepository;
import com.sun.deploy.panel.ITreeNode;
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
    private BusinessOrderRepository businessOrderRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

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

    @PostMapping("/{warehouseId}/{vehicleId}")
    public ResponseEntity<Route> newRoute(@RequestBody Route route,
                                          @PathVariable Long warehouseId, @PathVariable Long vehicleId){
        Optional<Warehouse> wh = warehouseRepository.findById(warehouseId);
        Optional<Vehicle> vh = vehicleRepository.findById(vehicleId);
        route.setWarehouse(wh.get());
        route.setVehicle(vh.get());

        Long invoiceId = null;
        Long orderId = null;

        if(route.getBusinessOrder() != null){
            orderId = route.getBusinessOrder().getId();
            route.setInvoice(null);
        }
        if(route.getInvoice() != null){
            invoiceId = route.getInvoice().getId();
            route.setBusinessOrder(null);
        }

        Route savedRoute = routeRepository.save(route);
        if(invoiceId != null){
            Optional<Invoice> invoice = invoiceRepository.findById(invoiceId);
            Invoice tmp = invoice.get();
            tmp.setRoute(route);
            invoiceRepository.save(tmp);
        }
        if(orderId != null) {
            Optional<BusinessOrder> order = businessOrderRepository.findById(orderId);
            BusinessOrder tmp = order.get();
            tmp.setRoute(route);
            businessOrderRepository.save(tmp);
        }
        return ResponseEntity.ok(savedRoute);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Route> modifyRouteById(@PathVariable Long id, @RequestBody Route route){
        Optional<Route> oldRoute = routeRepository.findById(id);
        if(oldRoute.isPresent()){
            Optional<Invoice> inv = invoiceRepository.findInvoiceByRoute(oldRoute.get().getId());
            Optional<BusinessOrder> ord = businessOrderRepository.findOrderByRoute(oldRoute.get().getId());
            if(inv.isPresent()){
                Invoice i = inv.get();
                i.setRoute(null);
                invoiceRepository.save(i);
            }
            if(ord.isPresent()){
                BusinessOrder o = ord.get();
                o.setRoute(null);
                businessOrderRepository.save(o);
            }
            if(route.getInvoice() != null){
                Optional<Invoice> invoice = invoiceRepository.findById(route.getInvoice().getId());
                Invoice tmp = invoice.get();
                tmp.setRoute(route);
                invoiceRepository.save(tmp);
                route.setInvoice(null);
            }
            if(route.getBusinessOrder() != null){
                Optional<BusinessOrder> order = businessOrderRepository.findById(route.getBusinessOrder().getId());
                BusinessOrder tmp = order.get();
                tmp.setRoute(route);
                businessOrderRepository.save(tmp);
                route.setBusinessOrder(null);
            }

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
            Route route = oldRoute.get();
            if(route.getInvoice() != null){
                Optional<Invoice> invoice = invoiceRepository.findById(route.getInvoice().getId());
                Invoice tmp = invoice.get();
                tmp.setRoute(null);
                invoiceRepository.save(tmp);
                route.setInvoice(null);
            }
            if(route.getBusinessOrder() != null){
                Optional<BusinessOrder> order = businessOrderRepository.findById(route.getBusinessOrder().getId());
                BusinessOrder tmp = order.get();
                tmp.setRoute(null);
                businessOrderRepository.save(tmp);
                route.setBusinessOrder(null);
            }
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
