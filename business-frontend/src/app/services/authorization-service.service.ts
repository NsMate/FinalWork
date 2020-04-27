import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppUser } from '../models/AppUser/app-user';
import { Employee } from '../models/Employee/employee';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': '',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  public isLoggedIn: boolean = false;
  public appUser: AppUser;
  public redirectUrl: string;
  public ownCompanyExists: boolean;

  private authUrl: string = 'http://localhost:8080/app_users';

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private routing: Router
  ) { }

  async login(appUserName: string, appUserPassword: string): Promise<AppUser> {
    try {
      const token = btoa(`${appUserName}:${appUserPassword}`);
      httpOptions.headers = httpOptions.headers.set('Authorization', `Basic ${token}`);
      const user = await this.http.post<AppUser>(`${this.authUrl}/login`, {}, httpOptions).toPromise();
      this.isLoggedIn = true;
      this.appUser = user;      
      console.log(user);
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("name", appUserName);
      localStorage.setItem("password", appUserPassword);
      return Promise.resolve(this.appUser);      
    } catch (e) {
      console.log(e);
      return Promise.reject();
    }
  }

  registerUser(employee: Employee, appUser: AppUser): Promise<AppUser>{
    return this.http.post<AppUser>(`${this.authUrl}/${employee.id}/register`, appUser, httpOptions).toPromise();
  }

  updateUser(appUser: AppUser): Promise<AppUser>{
    return this.http.put<AppUser>(`${this.authUrl}/${appUser.id}`, appUser, httpOptions).toPromise();
  }

  updateUserWithNewPassword(appUser: AppUser): Promise<AppUser>{
    return this.http.put<AppUser>(`${this.authUrl}/newPassword/${appUser.id}`, appUser, httpOptions).toPromise();
  }
  
  deleteUser(id:number): Promise<AppUser>{
    return this.http.delete<AppUser>(`${this.authUrl}/${id}`, httpOptions).toPromise();
  }

  logout() {
    httpOptions.headers = httpOptions.headers.set('Authorization', ``);
    this.isLoggedIn = false;
    this.appUser = null;
    sessionStorage.clear();
    localStorage.clear();

    this._snackBar.open('Sikeresen kijelentkezett!','',{
      duration:2000,
      panelClass: ['success'],
    })

    this.routing.navigate(['']);
  }
}
