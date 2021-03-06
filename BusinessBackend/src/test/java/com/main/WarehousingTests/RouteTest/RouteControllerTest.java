package com.main.WarehousingTests.RouteTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.main.Controllers.Warehouse.RouteController;
import com.main.Entites.Warehouse.Route;
import com.main.Entites.Warehouse.Vehicle;
import com.main.Entites.Warehouse.Warehouse;
import com.main.Repositories.Business.BusinessOrderRepository;
import com.main.Repositories.Business.InvoiceRepository;
import com.main.Repositories.Warehouse.RouteRepository;
import com.main.Repositories.Warehouse.VehicleRepository;
import com.main.Repositories.Warehouse.WarehouseRepository;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(RouteController.class)
@RunWith(SpringRunner.class)
public class RouteControllerTest {

    @Autowired
    MockMvc mvc;

    @MockBean
    private RouteRepository routeRepository;

    @MockBean
    private WarehouseRepository warehouseRepository;

    @MockBean
    private BusinessOrderRepository businessOrderRepository;

    @MockBean
    private InvoiceRepository invoiceRepository;

    @MockBean
    private VehicleRepository vehicleRepository;

    private ObjectMapper mapper = new ObjectMapper();

    public Route createRoute(String date){
        Route route = new Route();
        route.setDeliveryDate(Date.valueOf(date));
        route.setRouteType("Bejövő");
        route.setStatus("Tervezett");
        return route;
    }

    public Warehouse createWarehouse(Long id){
        Warehouse warehouse = new Warehouse();
        warehouse.setId(id);
        warehouse.setZipCode(1111);
        warehouse.setCity("Budapest");
        warehouse.setStreet("Deák út");
        warehouse.setStreetNumber("12");
        return warehouse;
    }

    public Vehicle createVehicle(Long id, String licensePlateNumber){
        Vehicle vehicle = new Vehicle();
        vehicle.setId(id);
        vehicle.setWarehouse(null);
        vehicle.setLicensePlateNumber(licensePlateNumber);
        vehicle.setManufacturer("Ford");
        vehicle.setVehicleType("Transport");
        vehicle.setRouteList(null);
        return vehicle;
    };


    @Before
    public void before(){
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getAllRouteTest() throws Exception {
        Route route = createRoute("2020-04-20");
        List<Route> routes = new ArrayList<>();
        routes.add(route);

        Mockito.when(routeRepository.findAll()).thenReturn(routes);

        mvc.perform(get("/routes")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$[0].status").value("Tervezett"));

        Mockito.verify(routeRepository,Mockito.times(1)).findAll();
    }


    @Test
    public void getRouteByIdTest() throws Exception{
        Route route = createRoute("2020-12-12");
        route.setId(1L);

        Mockito.when(routeRepository.findById(route.getId())).thenReturn(Optional.of(route));

        mvc.perform(get("/routes/1")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.id").value(1L))
                    .andExpect(jsonPath("$.deliveryDate").value("2020-12-12"));

        Mockito.verify(routeRepository,Mockito.times(1)).findById(route.getId());
    }


    @Test
    public void postRouteTest() throws Exception{
        Route route = createRoute("2020-12-12");
        route.setId(1L);

        Mockito.when(routeRepository.save(route)).thenReturn(route);

        mvc.perform(post("/routes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(route)))
                        .andExpect(status().isOk())
                        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                        .andReturn();

        Assert.assertNotNull(route.getId());

        Mockito.verify(routeRepository,Mockito.times(1)).save(route);
    }

    @Test
    public void putRouteTest() throws Exception{
        Route route = createRoute("2020-12-12");
        route.setId(1L);
        Route newRoute = createRoute("2020-12-13");
        newRoute.setId(1L);

        Mockito.when(routeRepository.findById(route.getId())).thenReturn(Optional.of(route));
        Mockito.when(routeRepository.save(newRoute)).thenReturn(newRoute);

        mvc.perform(put("/routes/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(newRoute)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn();

        Assert.assertNotNull(newRoute.getId());

        Mockito.verify(routeRepository,Mockito.times(1)).findById(route.getId());
        Mockito.verify(routeRepository,Mockito.times(1)).save(newRoute);

    }

    @Test
    public void deleteRouteTest() throws Exception{
        Route route = createRoute("2020-12-12");
        route.setId(1L);

        Mockito.when(routeRepository.findById(1L)).thenReturn(Optional.of(route));

        mvc.perform(delete("/routes/1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());

        Mockito.verify(routeRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(routeRepository,Mockito.times(1)).deleteById(1L);
    }

    @Test
    public void getAllRoutesBetweenDatesTest() throws Exception {
        Route route = createRoute("2020-04-20");
        List<Route> routes = new ArrayList<>();
        routes.add(route);

        Mockito.when(routeRepository
                .getRoutesBetweenDates(Date.valueOf("2020-04-20"),Date.valueOf("2020-04-27"))).thenReturn(routes);

        mvc.perform(get("/routes/between/2020-04-20/2020-04-27")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].status").value("Tervezett"));

        Mockito.verify(routeRepository,Mockito.times(1))
                .getRoutesBetweenDates(Date.valueOf("2020-04-20"),Date.valueOf("2020-04-27"));
    }
}
