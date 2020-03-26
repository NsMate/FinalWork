package com.main.Controllers.Warehouse;

import com.main.Entites.Warehouse.CalendarEvent;
import com.main.Entites.Warehouse.Route;
import com.main.Repositories.Warehouse.CalendarEventRepository;
import com.main.Repositories.Warehouse.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/calendar_events")
public class CalendarEventController {

    @Autowired
    private CalendarEventRepository calendarEventRepository;

    @Autowired
    private RouteRepository routeRepository;

    @GetMapping("")
    public ResponseEntity<Iterable<CalendarEvent>> getAll(){
        return ResponseEntity.ok(calendarEventRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalendarEvent> getEventById(@PathVariable Long id){
        Optional<CalendarEvent> event = calendarEventRepository.findById(id);
        if(event.isPresent()){
            return ResponseEntity.ok(event.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("")
    public ResponseEntity<CalendarEvent> newEvent(@RequestBody CalendarEvent calendarEvent){
        CalendarEvent savedCalendarEvent = calendarEventRepository.save(calendarEvent);
        return ResponseEntity.ok(savedCalendarEvent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CalendarEvent> modifyEventById(@PathVariable Long id, @RequestBody CalendarEvent calendarEvent){
        Optional<CalendarEvent> oldCalendarEvent = calendarEventRepository.findById(id);
        if(oldCalendarEvent.isPresent()){
            calendarEvent.setId(id);
            return ResponseEntity.ok(calendarEventRepository.save(calendarEvent));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteById(@PathVariable Long id){
        Optional<CalendarEvent> oldCalendarEvent = calendarEventRepository.findById(id);
        if(oldCalendarEvent.isPresent()){
            calendarEventRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/route")
    public ResponseEntity<Route> getRouteFromEventById(@PathVariable Long id){
        Optional<CalendarEvent> calendarEvent = calendarEventRepository.findById(id);
        if(calendarEvent.isPresent()){
            return ResponseEntity.ok(calendarEvent.get().getRoute());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/route")
    public ResponseEntity<Route> newRouteForCalendarEvent(@PathVariable Long id, @RequestBody Route route){
        Optional<CalendarEvent> calendarEvent = calendarEventRepository.findById(id);
        if(calendarEvent.isPresent()){
            CalendarEvent event = calendarEvent.get();
            Route newRoute = routeRepository.save(route);
            event.setRoute(newRoute);
            routeRepository.save(route);
            return ResponseEntity.ok(newRoute);
        }else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/route")
    public ResponseEntity<Route> modifyRouteInEventById(@PathVariable Long id, @RequestBody Route route) {
        Optional<CalendarEvent> oldCalendarEvent = calendarEventRepository.findById(id);
        if (oldCalendarEvent.isPresent()) {
            CalendarEvent calendarEvent = oldCalendarEvent.get();

            calendarEvent.setRoute(route);
            calendarEventRepository.save(calendarEvent);
            return ResponseEntity.ok(route);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
