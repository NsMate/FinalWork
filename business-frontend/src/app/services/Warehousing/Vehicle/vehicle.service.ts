import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Vehicle } from 'src/app/models/Warehousing/Vehicle/vehicle';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private vehicleURL:string = "http://localhost:8080/vehicles";

  constructor(
    private http: HttpClient
  ) { }

  getVehicles(): Promise<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.vehicleURL}`, httpOptions).toPromise();
  }

  getVehicle(id: number): Promise<Vehicle> {
    return this.http.get<Vehicle>(`${this.vehicleURL}/${id}`, httpOptions).toPromise();
  }
  
  createVehicle(vehicle: Vehicle): Promise<Vehicle> {
    return this.http.post<Vehicle>(`${this.vehicleURL}`, vehicle, httpOptions).toPromise();
  }
  
  updateVehicle(vehicle: Vehicle): Promise<Vehicle> {
    return this.http.put<Vehicle>(`${this.vehicleURL}/${vehicle.id}`, vehicle, httpOptions).toPromise();
  }
  
  deleteVehicle(id): Promise<Vehicle> {
    return this.http.delete<Vehicle>(`${this.vehicleURL}/${id}`, httpOptions).toPromise();
  }
}
