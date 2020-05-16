package com.main.WarehousingTests.VehicleTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.main.Controllers.Warehouse.VehicleController;
import com.main.Entites.Warehouse.Vehicle;
import com.main.Repositories.Warehouse.VehicleRepository;
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
import org.springframework.test.web.servlet.ResultActions;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VehicleController.class)
@RunWith(SpringRunner.class)
public class VehicleControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private VehicleRepository vehicleRepository;

    private ObjectMapper mapper = new ObjectMapper();

    public Vehicle createVehicle(Long id,String licensePlateNumber){
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
    public void setup(){
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getAllVehiclesTest() throws Exception{
        Vehicle vehicleToReturn1 = createVehicle(1L,"KLM-456");
        Vehicle vehicleToReturn2 = createVehicle(2L,"KLM-426");

        List<Vehicle> vehicles = new ArrayList<>();
        vehicles.add(vehicleToReturn1);
        vehicles.add(vehicleToReturn2);

        Mockito.when(vehicleRepository.findAll()).thenReturn(vehicles);

        mvc.perform(get("/vehicles")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        Mockito.verify(vehicleRepository, Mockito.times(1)).findAll();
    }

    @Test
    public void getVehicleByIdTest() throws Exception{
       Vehicle vehicleToReturn = createVehicle(2L,"KLM-456");

       Mockito.when(vehicleRepository.findById(vehicleToReturn.getId())).thenReturn(Optional.of(vehicleToReturn));

       ResultActions resultActions = mvc.perform(get("/vehicles/" + vehicleToReturn.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

       Vehicle vehicleReturned = mapper.readValue(resultActions.andReturn().getResponse().getContentAsString(), Vehicle.class);

       Assert.assertEquals(vehicleReturned.getId(),vehicleToReturn.getId());

       Mockito.verify(vehicleRepository, Mockito.times(1)).findById(vehicleToReturn.getId());
    }

    @Test
    public void createVehicleTest() throws Exception{
        Vehicle vehicle = createVehicle(1L,"KLM-123");

        Mockito.when(vehicleRepository.save(Mockito.any(Vehicle.class))).thenReturn(vehicle);

        ResultActions resultActions = mvc.perform(post("/vehicles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(vehicle)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        Vehicle createdVehicle = mapper.readValue(resultActions.andReturn().getResponse().getContentAsString(), Vehicle.class);

        Assert.assertEquals(vehicle.getId(),createdVehicle.getId());

        Mockito.verify(vehicleRepository,Mockito.times(1)).save(vehicle);
    }

    @Test
    public void modifyVehicleTest() throws Exception{
        Vehicle newVehicle = createVehicle(1L, "KLM-345");

        Mockito.when(vehicleRepository.findById(newVehicle.getId())).thenReturn(Optional.of(newVehicle));
        Mockito.when(vehicleRepository.save(Mockito.any(Vehicle.class))).thenReturn(newVehicle);

        ResultActions resultActions = mvc.perform(put("/vehicles/" + newVehicle.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(newVehicle)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        Vehicle createdVehicle = mapper.readValue(resultActions.andReturn().getResponse().getContentAsString(), Vehicle.class);

        Assert.assertEquals(createdVehicle.getId(),newVehicle.getId());

        Mockito.verify(vehicleRepository, Mockito.times(1)).findById(newVehicle.getId());
        Mockito.verify(vehicleRepository, Mockito.times(1)).save(Mockito.any(Vehicle.class));
    }

    @Test
    public void deleteVehicleTest() throws Exception{
        Vehicle vehicle = createVehicle(1L, "KLM-123");

        Mockito.when(vehicleRepository.findById(vehicle.getId())).thenReturn(Optional.of(vehicle));

        mvc.perform(delete("/vehicles/" + vehicle.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        Mockito.verify(vehicleRepository, Mockito.times(1)).deleteById(vehicle.getId());
        Mockito.verify(vehicleRepository, Mockito.times(1)).findById(vehicle.getId());
    }

}
