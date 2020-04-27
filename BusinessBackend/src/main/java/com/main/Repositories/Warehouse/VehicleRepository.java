package com.main.Repositories.Warehouse;

import com.main.Entites.Warehouse.Vehicle;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends CrudRepository<Vehicle, Long> {

    @Query("select v from Vehicle v where v.warehouse = null and vehicleType = 'Szállítás'")
    List<Vehicle> getFreeVehicles();

}
