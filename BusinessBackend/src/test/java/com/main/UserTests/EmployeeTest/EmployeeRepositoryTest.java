package com.main.UserTests.EmployeeTest;

import com.main.Entites.User.Employee;
import com.main.Entites.Warehouse.Warehouse;
import com.main.Repositories.User.EmployeeRepository;
import com.main.Repositories.Warehouse.WarehouseRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RunWith(SpringRunner.class)
@DataJpaTest
@ActiveProfiles("test")
public class EmployeeRepositoryTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    WarehouseRepository warehouseRepository;

    public Employee createEmployee(String dep, Warehouse warehouse){
        Employee emp = new Employee();
        emp.setDepartment(dep);
        emp.setEmail("asd@asd");
        emp.setFirstName("Test");
        emp.setLastName("Testinh");
        emp.setPhoneNumber("06201111111");
        emp.setWarehouse(warehouse);
        return employeeRepository.save(emp);
    }
    public Warehouse createWarehouse(Long id){
        Warehouse warehouse = new Warehouse();
        warehouse.setId(id);
        warehouse.setZipCode(1111);
        warehouse.setCity("Budapest");
        warehouse.setStreet("Deák út");
        warehouse.setStreetNumber("12");
        return warehouseRepository.save(warehouse);
    }

    @Test
    public void getAllFreeWorkersFromDbTest(){
        employeeRepository.deleteAll();
        Warehouse warehouse = createWarehouse(1L);
        Optional<Warehouse> wh = warehouseRepository.findById(warehouse.getId());

        Employee empFalse = createEmployee("Vezető",null);
        Employee empFalse1 = createEmployee("Pénzügy",null);
        Employee empFalse2 = createEmployee("Munkás", wh.get());

        Employee empOk = createEmployee("Munkás",null);
        Employee empOk1 = createEmployee("Munkás",null);
        Employee empOk2 = createEmployee("Munkás",null);

        List<Employee> employees = new ArrayList<>();

        employees = employeeRepository.getAllFreeWorkers();
        System.out.println(employees);

        Assert.assertEquals(3,employees.size());
    }
}
