package com.main.UserTests.EmployeeTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.main.Controllers.User.EmployeeController;
import com.main.Entites.User.Employee;
import com.main.Repositories.User.EmployeeRepository;
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

@WebMvcTest(EmployeeController.class)
@RunWith(SpringRunner.class)
public class EmployeeControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private EmployeeRepository employeeRepository;

    private ObjectMapper mapper = new ObjectMapper();

    public Employee createEmployee(){
        Employee emp = new Employee();
        emp.setDepartment("Munkás");
        emp.setEmail("asd@asd");
        emp.setFirstName("Nagy");
        emp.setLastName("András");
        emp.setPhoneNumber("06201111111");
        emp.setWarehouse(null);
        return emp;
    }

    @Before
    public void setup(){
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getAllEmployeeTest() throws Exception{
        Employee employee = createEmployee();
        employee.setFirstName("Máté");
        Employee employee1 = createEmployee();
        employee1.setFirstName("András");
        List<Employee> employeeList = new ArrayList<>();
        employeeList.add(employee);
        employeeList.add(employee1);

        Mockito.when(employeeRepository.findAll()).thenReturn(employeeList);

        mvc.perform(get("/employees")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].firstName").value("Máté"))
                .andExpect(jsonPath("$[1].firstName").value("András"));

        Mockito.verify(employeeRepository,Mockito.times(1)).findAll();
    }

    @Test
    public void getEmployeeByIdTest() throws Exception{
        Employee employeeToFind = createEmployee();
        employeeToFind.setId(1L);

        Mockito.when(employeeRepository.findById(1L)).thenReturn(Optional.of(employeeToFind));

        mvc.perform(get("/employees/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L));

        Mockito.verify(employeeRepository,Mockito.times(1)).findById(1L);
    }

    @Test
    public void createEmployeeTest() throws Exception{
        Employee employee = createEmployee();
        employee.setId(1L);

        Mockito.when(employeeRepository.save(employee)).thenReturn(employee);

        mvc.perform(post("/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(employee)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        Mockito.verify(employeeRepository,Mockito.times(1)).save(employee);
    }

    @Test
    public void modifyEmployeeTest() throws Exception{
        Employee employee = createEmployee();
        employee.setId(1L);

        Mockito.when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        Mockito.when(employeeRepository.save(employee)).thenReturn(employee);

        mvc.perform(put("/employees/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(employee)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        Mockito.verify(employeeRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(employeeRepository,Mockito.times(1)).save(employee);

    }

    @Test
    public void deleteEmployeeTest() throws Exception{
        Employee employee = createEmployee();
        employee.setId(1L);

        Mockito.when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        mvc.perform(delete("/employees/1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());

        Mockito.verify(employeeRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(employeeRepository,Mockito.times(1)).deleteById(1L);
    }

    @Test
    public void getFreeWorkersTest() throws Exception{
        Employee employee = createEmployee();
        employee.setFirstName("Máté");
        Employee employee1 = createEmployee();
        employee1.setFirstName("Márk");
        List<Employee> employeeList = new ArrayList<>();
        employeeList.add(employee);
        employeeList.add(employee1);

        Mockito.when(employeeRepository.getAllFreeWorkers()).thenReturn(employeeList);

        mvc.perform(get("/employees/freeWorkers")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].firstName").value("Máté"))
                .andExpect(jsonPath("$[1].firstName").value("Márk"));

        Mockito.verify(employeeRepository,Mockito.times(1)).getAllFreeWorkers();
    }

    @Test
    public void getEmployeesUserByIdTest() throws Exception{
        Employee employeeToFind = createEmployee();
        employeeToFind.setId(1L);

        Mockito.when(employeeRepository.findById(1L)).thenReturn(Optional.of(employeeToFind));

        mvc.perform(get("/employees/1/user")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        Mockito.verify(employeeRepository,Mockito.times(1)).findById(1L);
    }

    @Test
    public void putEmployeesUserByIdTest() throws Exception{
        Employee employeeToFind = createEmployee();
        employeeToFind.setId(1L);
        employeeToFind.setWarehouse(null);

        Mockito.when(employeeRepository.findById(1L)).thenReturn(Optional.of(employeeToFind));
        Mockito.when(employeeRepository.save(employeeToFind)).thenReturn(employeeToFind);

        mvc.perform(put("/employees/1/unbind")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        Mockito.verify(employeeRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(employeeRepository,Mockito.times(1)).save(employeeToFind);
    }
}
