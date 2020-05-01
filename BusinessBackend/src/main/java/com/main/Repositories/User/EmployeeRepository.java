package com.main.Repositories.User;

import com.main.Entites.User.Employee;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends CrudRepository<Employee,Long> {

    @Query("select e from Employee e where (e.warehouse is null and e.department = 'Munkás')")
    List<Employee> getAllFreeWorkers();
}
