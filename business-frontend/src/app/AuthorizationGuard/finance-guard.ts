import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../services/authorization-service.service';

@Injectable({
  providedIn: 'root'
})
export class FinanceGuard implements CanActivate {
  constructor(private authService: AuthorizationService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (localStorage.getItem("loggedIn") != null) {
      this.authService.isLoggedIn = true;
      this.authService.login(localStorage.getItem("name"),localStorage.getItem("password"))
      if(this.authService.appUser.appUserGroup == 'ROLE_FINANCE' || 
        this.authService.appUser.appUserGroup == 'ROLE_ADMIN'){
        return true;
      }
    }else{
        this.router.navigate(['/login']);
    }

  }
  
}
