package com.main.WarehousingTests.WarehouseTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.main.Controllers.Warehouse.WarehouseController;
import com.main.Entites.User.Employee;
import com.main.Entites.Warehouse.Stock;
import com.main.Entites.Warehouse.Vehicle;
import com.main.Entites.Warehouse.Warehouse;
import com.main.Repositories.User.EmployeeRepository;
import com.main.Repositories.Warehouse.StockRepository;
import com.main.Repositories.Warehouse.VehicleRepository;
import com.main.Repositories.Warehouse.WarehouseRepository;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WarehouseController.class)
@RunWith(SpringRunner.class)
public class WarehouseControllerTest {

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
    public Stock createStock(){
        Stock stock = new Stock();
        stock.setQuantity(10);
        stock.setUnit("kg");
        return stock;
    }
    public Employee createEmployee(){
        Employee emp = new Employee();
        emp.setDepartment("Dep");
        emp.setEmail("asd@äsd");
        emp.setFirstName("Test");
        emp.setLastName("Testinh");
        emp.setPhoneNumber("06201111111");
        return emp;
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

    @Autowired
    MockMvc mvc;

    @MockBean
    private WarehouseRepository warehouseRepository;

    @MockBean
    private EmployeeRepository employeeRepository;

    @MockBean
    private VehicleRepository vehicleRepository;

    @MockBean
    private StockRepository stockRepository;

    private ObjectMapper mapper = new ObjectMapper();

    @Before
    public void before(){
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getAllWarehousesTest() throws Exception {
        Warehouse warehouse = createWarehouse(1L);
        Warehouse warehouse2 = createWarehouse(2L);
        List<Warehouse> warehouses = new ArrayList<>();
        warehouses.add(warehouse);
        warehouses.add(warehouse2);

        Mockito.when(warehouseRepository.findAll()).thenReturn(warehouses);

        mvc.perform(get("/warehouses")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].id").value(2L));

        Mockito.verify(warehouseRepository,Mockito.times(1)).findAll();
    }

    @Test
    public void getWarehouseByIdTest() throws Exception {
        Warehouse warehouse = createWarehouse(1L);

        Mockito.when(warehouseRepository.findById(1L)).thenReturn(Optional.of(warehouse));

        mvc.perform(get("/warehouses/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L));

        Mockito.verify(warehouseRepository,Mockito.times(1)).findById(1L);
    }

    @Test
    public void postWarehouseTest() throws Exception {
        Warehouse warehouse = createWarehouse(1L);

        Mockito.when(warehouseRepository.save(warehouse)).thenReturn(warehouse);

        mvc.perform(post("/warehouses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(warehouse)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        Mockito.verify(warehouseRepository,Mockito.times(1)).save(warehouse);
    }

    @Test
    public void putWarehouseTest() throws Exception {
        Warehouse warehouse = createWarehouse(1L);
        Warehouse newWarehouse = createWarehouse(1L);

        Mockito.when(warehouseRepository.findById(1L)).thenReturn(Optional.of(warehouse));
        Mockito.when(warehouseRepository.save(newWarehouse)).thenReturn(newWarehouse);

        mvc.perform(put("/warehouses/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(newWarehouse)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        Mockito.verify(warehouseRepository,Mockito.times(1)).save(warehouse);
        Mockito.verify(warehouseRepository,Mockito.times(1)).findById(warehouse.getId());
    }

    @Test
    public void deleteWarehouseTest() throws Exception{
        Warehouse warehouse = createWarehouse(1L);
        warehouse.setVehicleList(new ArrayList<>());
        warehouse.setEmployeeList(new ArrayList<>());
        Vehicle vehicleWithNoWarehouse = createVehicle(1L,"ASD-122");
        Employee employeeWithNoWarehouse = createEmployee();
        vehicleWithNoWarehouse.setWarehouse(null);
        employeeWithNoWarehouse.setWarehouse(null);

        Mockito.when(warehouseRepository.findById(1L)).thenReturn(Optional.of(warehouse));
        Mockito.when(vehicleRepository.save(vehicleWithNoWarehouse)).thenReturn(vehicleWithNoWarehouse);
        Mockito.when(employeeRepository.save(employeeWithNoWarehouse)).thenReturn(employeeWithNoWarehouse);


        mvc.perform(delete("/warehouses/1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());


        Mockito.verify(warehouseRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(warehouseRepository,Mockito.times(1)).deleteById(1L);
        Mockito.verify(employeeRepository,
                Mockito.times(warehouse.getEmployeeList().size())).save(employeeWithNoWarehouse);
        Mockito.verify(vehicleRepository,
                Mockito.times(warehouse.getVehicleList().size())).save(vehicleWithNoWarehouse);
    }

    @Test
    public void postStockInWarehouseTest() throws Exception {
        Warehouse warehouse = createWarehouse(1L);
        Stock stock = createStock();
        stock.setWarehouse(warehouse);

        Mockito.when(warehouseRepository.findById(1L)).thenReturn(Optional.of(warehouse));
        Mockito.when(stockRepository.save(stock)).thenReturn(stock);

        mvc.perform(post("/warehouses/1/stocks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(stock)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        Mockito.verify(warehouseRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(stockRepository,Mockito.times(1)).save(stock);

    }

    @Test
    public void postEmployeeInWarehouseTest() throws Exception {
        Warehouse warehouse = createWarehouse(1L);
        Employee emp = createEmployee();
        emp.setWarehouse(warehouse);

        Mockito.when(warehouseRepository.findById(1L)).thenReturn(Optional.of(warehouse));
        Mockito.when(employeeRepository.save(emp)).thenReturn(emp);

        mvc.perform(post("/warehouses/1/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(emp)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        Mockito.verify(warehouseRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(employeeRepository,Mockito.times(1)).save(emp);

    }

    @Test
    public void postVehicleInWarehouseTest() throws Exception {
        Warehouse warehouse = createWarehouse(1L);
        Vehicle vehicle = createVehicle(1L,"ABD-123");
        vehicle.setWarehouse(warehouse);

        Mockito.when(warehouseRepository.findById(1L)).thenReturn(Optional.of(warehouse));
        Mockito.when(vehicleRepository.save(vehicle)).thenReturn(vehicle);

        mvc.perform(post("/warehouses/1/vehicles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(vehicle)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        Mockito.verify(warehouseRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(vehicleRepository,Mockito.times(1)).save(vehicle);

    }
}
