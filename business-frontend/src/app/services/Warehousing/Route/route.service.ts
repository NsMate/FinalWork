import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Route } from 'src/app/models/Warehousing/Route/route';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private routeURL: string = "http://localhost:8080/routes";

  constructor(
    private http: HttpClient
  ) { }

  getRoutes(): Promise<Route[]> {
    return this.http.get<Route[]>(`${this.routeURL}`, httpOptions).toPromise();
  }

  getRoute(id: number): Promise<Route> {
    return this.http.get<Route>(`${this.routeURL}/${id}`, httpOptions).toPromise();
  }
  
  createRoute(route: Route): Promise<Route> {
    return this.http.post<Route>(`${this.routeURL}`, route, httpOptions).toPromise();
  }
  
  updateRoute(route: Route): Promise<Route> {
    return this.http.put<Route>(`${this.routeURL}/${route.id}`, route, httpOptions).toPromise();
  }
  
  deleteRoute(id): Promise<Route> {
    return this.http.delete<Route>(`${this.routeURL}/${id}`, httpOptions).toPromise();
  }

}
