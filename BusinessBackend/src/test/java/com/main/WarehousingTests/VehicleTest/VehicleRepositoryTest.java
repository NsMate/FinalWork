package com.main.WarehousingTests.VehicleTest;

import com.main.Entites.Warehouse.Vehicle;
import com.main.Entites.Warehouse.Warehouse;
import com.main.Repositories.Warehouse.VehicleRepository;
import com.main.Repositories.Warehouse.WarehouseRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RunWith(SpringRunner.class)
@DataJpaTest
@ActiveProfiles("test")
public class VehicleRepositoryTest {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    public Vehicle createVehicle(Long id, String licensePlateNumber){
        Vehicle vehicle = new Vehicle();
        vehicle.setId(id);
        vehicle.setWarehouse(null);
        vehicle.setLicensePlateNumber(licensePlateNumber);
        vehicle.setManufacturer("Ford");
        vehicle.setVehicleType("Transport");
        vehicle.setRouteList(null);
        return vehicleRepository.save(vehicle);
    };

    public Warehouse createWarehouse(Long id){
        Warehouse warehouse = new Warehouse();
        warehouse.setId(id);
        warehouse.setZipCode(BigDecimal.valueOf(1111));
        warehouse.setCity("Budapest");
        warehouse.setStreet("Deák út");
        warehouse.setStreetNumber("12");
        return warehouseRepository.save(warehouse);
    }

    @Test
    public void savingVehicleToDb(){
        Vehicle vehicle = createVehicle(null,"KLM-123");

        List<Vehicle> vehicleList = new ArrayList<>();
        vehicleRepository.findAll().forEach(vehicleList::add);

        Assert.assertEquals(1,vehicleList.size());
        Assert.assertNotNull(vehicleList.get(0).getId());
    }

    @Test
    public void getAllVehiclesFromDb(){
        Vehicle vehicle1 = createVehicle(null,"KLM-123");
        Vehicle vehicle2 = createVehicle(null,"KLM-345");

        vehicleRepository.save(vehicle1);
        vehicleRepository.save(vehicle2);

        List<Vehicle> vehicleList = new ArrayList<>();
        vehicleRepository.findAll().forEach(vehicleList::add);

        Assert.assertEquals(2,vehicleList.size());
    }

    @Test
    public void deleteVehicleFromDb(){
        Vehicle vehicleToDelete = createVehicle(null,"KLM-123");

        Optional<Vehicle> foundVehicle = vehicleRepository.findById(vehicleToDelete.getId());

        Assert.assertTrue(foundVehicle.isPresent());

        vehicleRepository.deleteById(vehicleToDelete.getId());

        Optional<Vehicle> notFoundVehicle = vehicleRepository.findById(vehicleToDelete.getId());

        Assert.assertTrue(!notFoundVehicle.isPresent());
    }

    @Test
    public void gettingFreeVehiclesFromDb(){
        Warehouse warehouse = createWarehouse(1L);

        Vehicle freeVehicle = createVehicle(null,"KLM-123");
        Vehicle freeVehicle2 = createVehicle(null,"KLM-456");
        Vehicle notFree = createVehicle(null,"ABD-123");
        notFree.setWarehouse(warehouseRepository.findById(warehouse.getId()).get());
        Vehicle notFree2 = createVehicle(null,"ABD-456");
        notFree2.setWarehouse(warehouseRepository.findById(warehouse.getId()).get());

        vehicleRepository.save(freeVehicle);
        vehicleRepository.save(freeVehicle2);
        vehicleRepository.save(notFree);
        vehicleRepository.save(notFree2);

        warehouseRepository.save(warehouse);

        List<Vehicle> vehicleList = new ArrayList<>();
        vehicleRepository.getFreeVehicles().forEach(vehicleList::add);

        Assert.assertEquals(2,vehicleList.size());
    }
}
