import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppUser } from '../models/AppUser/app-user';

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

  private authUrl: string = 'http://localhost:8080/app_users';

  constructor(
    private http: HttpClient
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
  
  logout() {
    httpOptions.headers = httpOptions.headers.set('Authorization', ``);
    this.isLoggedIn = false;
    this.appUser = null;
  }
}
