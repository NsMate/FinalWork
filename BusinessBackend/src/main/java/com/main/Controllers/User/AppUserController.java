package com.main.Controllers.User;

import com.main.Entites.User.AppUser;
import com.main.Entites.User.Employee;
import com.main.Repositories.User.AppUserRepository;
import com.main.Repositories.User.EmployeeRepository;
import com.main.Security.AuthenticatedUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/app_users")
public class AppUserController {

    @Autowired
    AppUserRepository appUserRepository;

    @Autowired
    private AuthenticatedUser authenticatedUser;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping("")
    public ResponseEntity<Iterable<AppUser>> getAll(){
        return ResponseEntity.ok(appUserRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppUser> getAppUserById(@PathVariable Long id){
        Optional<AppUser> appUser = appUserRepository.findById(id);
        if(appUser.isPresent()){
            return ResponseEntity.ok(appUser.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppUser> modifyAppUserById(@PathVariable Long id, @RequestBody AppUser appUser){
        Optional<AppUser> oldUser = appUserRepository.findById(id);
        if(oldUser.isPresent()){
            appUser.setId(id);
            
            return ResponseEntity.ok(appUserRepository.save(appUser));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/newPassword/{id}")
    public ResponseEntity<AppUser> modifyAppUserByIdNewPassword(@PathVariable Long id, @RequestBody AppUser appUser){
        Optional<AppUser> oldUser = appUserRepository.findById(id);
        if(oldUser.isPresent()){
            appUser.setId(id);
            appUser.setAppUserPassword(passwordEncoder.encode(appUser.getAppUserPassword()));
            return ResponseEntity.ok(appUserRepository.save(appUser));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteAppUserById(@PathVariable Long id){
        Optional<AppUser> oldUser = appUserRepository.findById(id);
        if(oldUser.isPresent()){
            appUserRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<AppUser> register(@PathVariable Long id, @RequestBody AppUser appUser) {
        Optional<AppUser> oUser = appUserRepository.findByAppUserName(appUser.getAppUserName());
        Optional<Employee> choosenEmployee = employeeRepository.findById(id);
        if (oUser.isPresent() || !choosenEmployee.isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        appUser.setAppUserPassword(passwordEncoder.encode(appUser.getAppUserPassword()));
        appUser.setAppUserGroup(appUser.getAppUserGroup());
        appUser.setEmployee(choosenEmployee.get());
        return ResponseEntity.ok(appUserRepository.save(appUser));
    }

    @PostMapping("login")
    public ResponseEntity<AppUser> login() {
        return ResponseEntity.ok(authenticatedUser.getAppUser());
    }
}
