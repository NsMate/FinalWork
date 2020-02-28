package com.main.Security;

import com.main.Entites.User.AppUser;
import com.main.Repositories.User.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class MyUserDetailService implements UserDetailsService {
    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private AuthenticatedUser authenticatedUser;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String appUserName) throws UsernameNotFoundException {
        Optional<AppUser> oUser = appUserRepository.findByAppUserName(appUserName);
        if (!oUser.isPresent()) {
            throw new UsernameNotFoundException(appUserName);
        }
        AppUser user = oUser.get();
        authenticatedUser.setAppUser(user);
        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
        grantedAuthorities.add(new SimpleGrantedAuthority(user.getAppUserGroup().toString()));

        return new org.springframework.security.core.userdetails.User(user.getAppUserName(), user.getAppUserPassword(), grantedAuthorities);
    }
}
