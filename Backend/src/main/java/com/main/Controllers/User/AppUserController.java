package com.main.Controllers.User;

import com.main.Entites.User.AppUser;
import com.main.Repositories.User.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/app_users")
public class AppUserController {

    @Autowired
    AppUserRepository appUserRepository;

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

    @PostMapping("")
    public ResponseEntity<AppUser> newAppUser(@RequestBody AppUser appUser){
        AppUser newUser = appUserRepository.save(appUser);
        return ResponseEntity.ok(newUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppUser> modifyById(@PathVariable Long id, @RequestBody AppUser appUser){
        Optional<AppUser> oldUser = appUserRepository.findById(id);
        if(oldUser.isPresent()){
            appUser.setId(id);
            return ResponseEntity.ok(appUserRepository.save(appUser));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("")
    public ResponseEntity deleteAppUserById(@PathVariable Long id){
        Optional<AppUser> oldUser = appUserRepository.findById(id);
        if(oldUser.isPresent()){
            appUserRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }
}
