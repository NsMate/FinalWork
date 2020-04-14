package com.main.Repositories.Warehouse;

import com.main.Entites.Warehouse.Route;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Date;
import java.util.List;

public interface RouteRepository extends CrudRepository<Route, Long> {

    @Query("select r from Route r where r.deliveryDate between ?1 and ?2")
    List<Route> getRoutesBetweenDates(Date date1, Date date2);
}
