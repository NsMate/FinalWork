package com.main.UserTests.AppUserTest;

import com.main.Entites.User.AppUser;
import com.main.Entites.User.Employee;
import com.main.Entites.Warehouse.Warehouse;
import com.main.Repositories.User.AppUserRepository;
import com.main.Repositories.User.EmployeeRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Optional;

@RunWith(SpringRunner.class)
@DataJpaTest
@ActiveProfiles("test")
public class AppUserRepositoryTest {

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Employee createEmployee(String dep){
        Employee emp = new Employee();
        emp.setDepartment(dep);
        emp.setEmail("asd@asd");
        emp.setFirstName("Test");
        emp.setLastName("Testinh");
        emp.setPhoneNumber("06201111111");
        emp.setWarehouse(null);
        return employeeRepository.save(emp);
    }
    public AppUser createAppUser(Employee emp){
        AppUser user = new AppUser();
        user.setAppUserName("New");
        user.setAppUserPassword("password");
        user.setAppUserGroup(AppUser.Role.ROLE_ADMIN);
        user.setEmployee(emp);
        return appUserRepository.save(user);
    }

    @Test
    public void testingGetAppUserByNameFromDb(){
        appUserRepository.deleteAll();
        Employee emp = createEmployee("Vezető");
        AppUser user = createAppUser(emp);
        user.setAppUserName("User123");

        Optional<AppUser> foundUser = appUserRepository.findByAppUserName("User123");
        Optional<AppUser> notFoundUser = appUserRepository.findByAppUserName("User132");

        Assert.assertTrue(foundUser.isPresent());
        Assert.assertEquals("User123",foundUser.get().getAppUserName());
        Assert.assertFalse(notFoundUser.isPresent());

    }
}
