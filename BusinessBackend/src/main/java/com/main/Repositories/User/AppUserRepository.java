package com.main.Repositories.User;

import com.main.Entites.User.AppUser;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends CrudRepository<AppUser,Long> {

    Optional<AppUser> findByAppUserName(String appUserName);

}
