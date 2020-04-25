package com.main.WarehousingTests.RouteTest;

import com.main.Entites.Warehouse.Route;
import com.main.Repositories.Warehouse.RouteRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import javax.swing.*;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RunWith(SpringRunner.class)
@DataJpaTest
@ActiveProfiles("test")
public class RouteRepositoryTest {

    @Autowired
    private RouteRepository routeRepository;

    public Route createRoute(String date){
        Route route = new Route();
        route.setDeliveryDate(Date.valueOf(date));
        route.setRouteType("Bejövő");
        route.setStatus("Tervezett");
        return routeRepository.save(route);
    }

    @Test
    public void gettingRoutesBetweenDatesFromDb(){
        Route routeOk = createRoute("2020-04-20");
        Route routeOk1 = createRoute("2020-04-23");
        Route routeOk2 = createRoute("2020-04-26");

        Route routeFalse = createRoute("2020-04-19");
        Route routeFalse1 = createRoute("2020-04-27");

        routeRepository.save(routeOk);
        routeRepository.save(routeOk1);
        routeRepository.save(routeOk2);
        routeRepository.save(routeFalse);
        routeRepository.save(routeFalse1);

        List<Route> routesBetweenDates = new ArrayList<>();

        routesBetweenDates =
                routeRepository.getRoutesBetweenDates(Date.valueOf("2020-04-20"),Date.valueOf("2020-04-26"));

        Assert.assertEquals(3,routesBetweenDates.size());
    }

}
