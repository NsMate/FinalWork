package com.main.UserTests.AppUserTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.main.Controllers.User.AppUserController;
import com.main.Entites.User.AppUser;
import com.main.Entites.User.Employee;
import com.main.Repositories.User.AppUserRepository;
import com.main.Repositories.User.EmployeeRepository;
import com.main.Security.AuthenticatedUser;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AppUserController.class)
@RunWith(SpringRunner.class)
public class AppUserControllerTest {

    @Autowired
    MockMvc mvc;

    @MockBean
    private EmployeeRepository employeeRepository;

    @MockBean
    private AppUserRepository appUserRepository;

    @MockBean
    private AuthenticatedUser authenticatedUser;

    @MockBean
    private BCryptPasswordEncoder passwordEncoder;

    private ObjectMapper mapper = new ObjectMapper();

    public Employee createEmployee(String dep){
        Employee emp = new Employee();
        emp.setDepartment(dep);
        emp.setEmail("asd@asd");
        emp.setFirstName("Test");
        emp.setLastName("Testinh");
        emp.setPhoneNumber("06201111111");
        emp.setWarehouse(null);
        return emp;
    }
    public AppUser createAppUser(Employee emp){
        AppUser user = new AppUser();
        user.setAppUserName("New");
        user.setAppUserPassword("password");
        user.setAppUserGroup(AppUser.Role.ROLE_ADMIN);
        user.setEmployee(emp);
        return user;
    }

    @Before
    public void before(){
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testLoginEndpoint() throws Exception {
        Employee emp = createEmployee("Vezető");
        AppUser user = createAppUser(emp);

        Mockito.when(authenticatedUser.getAppUser()).thenReturn(user);

        mvc.perform(post("/app_users/login")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn();
    }

    @Test
    public void testGetUserByIdEndpoint() throws Exception {
        Employee emp = createEmployee("Vezető");
        AppUser user = createAppUser(emp);
        user.setAppUserName("User123");
        user.setId(1L);

        Mockito.when(appUserRepository.findById(1L)).thenReturn(Optional.of(user));

        mvc.perform(get("/app_users/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.appUserName").value("User123"))
                .andReturn();

        Mockito.verify(appUserRepository,Mockito.times(1)).findById(1L);
    }

    @Test
    public void deleteAppUserTest() throws Exception{
        Employee emp = createEmployee("Vezető");
        AppUser user = createAppUser(emp);
        user.setId(1L);

        Mockito.when(appUserRepository.findById(1L)).thenReturn(Optional.of(user));

        mvc.perform(delete("/app_users/1")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());

        Mockito.verify(appUserRepository,Mockito.times(1)).findById(1L);
        Mockito.verify(appUserRepository,Mockito.times(1)).deleteById(1L);
    }

    @Test
    public void testRegisterEndpoint() throws Exception {
        Employee emp = createEmployee("Vezető");
        emp.setId(1L);
        AppUser user = createAppUser(emp);
        user.setAppUserName("User123");
        user.setAppUserPassword("encodedPassword");

        Mockito.when(appUserRepository.findByAppUserName("User123")).thenReturn(null);
        Mockito.when(appUserRepository.save(user)).thenReturn(user);
        Mockito.when(employeeRepository.findById(1L)).thenReturn(Optional.of(emp));
        Mockito.when(authenticatedUser.getAppUser()).thenReturn(user);
        Mockito.when(passwordEncoder.encode(user.getAppUserPassword())).thenReturn("encodedPassword");

        mvc.perform(post("/app_users/login")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.appUserPassword").value("encodedPassword"))
                .andReturn();
    }

    @Test
    public void testModifyUserWithoutNewPassword() throws Exception {
        Employee emp = createEmployee("Vezető");
        AppUser user = createAppUser(emp);
        user.setId(1L);

        Mockito.when(appUserRepository.findById(1L)).thenReturn(Optional.of(user));
        Mockito.when(appUserRepository.save(user)).thenReturn(user);

        mvc.perform(put("/app_users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn();
    }

    @Test
    public void testModifyUserWithNewPassword() throws Exception {
        Employee emp = createEmployee("Vezető");
        AppUser user = createAppUser(emp);
        user.setId(1L);

        Mockito.when(appUserRepository.findById(1L)).thenReturn(Optional.of(user));
        Mockito.when(appUserRepository.save(user)).thenReturn(user);
        Mockito.when(passwordEncoder.encode(user.getAppUserPassword())).thenReturn("encodedPassword");

        mvc.perform(put("/app_users/newPassword/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andReturn();

        Mockito.verify(passwordEncoder,Mockito.times(1)).encode(user.getAppUserPassword());
    }
}
