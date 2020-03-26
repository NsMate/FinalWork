package com.main.Repositories.Warehouse;


import com.main.Entites.Warehouse.CalendarEvent;
import org.springframework.data.repository.CrudRepository;

public interface CalendarEventRepository extends CrudRepository<CalendarEvent, Long> {
}
