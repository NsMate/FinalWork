package com.main.Controllers.User;

import com.main.Entites.User.Employee;
import com.main.Repositories.User.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    public EmployeeRepository employeeRepository;

    @GetMapping("")
    public ResponseEntity<Iterable<Employee>> getAll() {
        return ResponseEntity.ok(employeeRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> findEmployeeById(@PathVariable Long id){
        Optional<Employee> employee = employeeRepository.findById(id);
        if(employee.isPresent()){
            return ResponseEntity.ok(employee.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<Employee> newEmployee(@RequestBody Employee employee){
        Employee savedEmployee = employeeRepository.save(employee);
        return ResponseEntity.ok(savedEmployee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> modifyEmployeeById(@PathVariable Long id, @RequestBody Employee employee){
        Optional<Employee> oldEmployee = employeeRepository.findById(id);
        if(oldEmployee.isPresent()){
            employee.setId(id);
            return ResponseEntity.ok(employeeRepository.save(employee));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteById(@PathVariable Long id){
        Optional<Employee> oldEmployee = employeeRepository.findById(id);
        if(oldEmployee.isPresent()){
            employeeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/freeWorkers")
    public ResponseEntity<Iterable<Employee>> getAllFreeWorkers(){
        List<Employee> workers = employeeRepository.getAllFreeWorkers();
        if(workers.isEmpty()){
            return null;
        }else{
            return ResponseEntity.ok(workers);
        }
    }
}