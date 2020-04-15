import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Employee } from 'src/app/models/Employee/employee';
import { AppUser } from 'src/app/models/AppUser/app-user';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private employeeUrl:string = "http://localhost:8080/employees";

  constructor(
    private http: HttpClient
  ) { }

  getEmployees(): Promise<Employee[]> {
    return this.http.get<Employee[]>(`${this.employeeUrl}`, httpOptions).toPromise();
  }

  getEmployee(id: number): Promise<Employee> {
    return this.http.get<Employee>(`${this.employeeUrl}/${id}`, httpOptions).toPromise();
  }
  
  createEmployee(employee: Employee): Promise<Employee> {
    return this.http.post<Employee>(`${this.employeeUrl}`, employee, httpOptions).toPromise();
  }
  
  updateEmployee(employee: Employee): Promise<Employee> {
    return this.http.put<Employee>(`${this.employeeUrl}/${employee.id}`, employee, httpOptions).toPromise();
  }
  
  deleteEmployee(id): Promise<Employee> {
    return this.http.delete<Employee>(`${this.employeeUrl}/${id}`, httpOptions).toPromise();
  }

  getFreeWorkers(): Promise<Employee[]>{
    return this.http.get<Employee[]>(`${this.employeeUrl}/freeWorkers`,httpOptions).toPromise();
  }

  getEmployeesUser(employee: Employee): Promise<AppUser>{
    return this.http.get<AppUser>(`${this.employeeUrl}/${employee.id}/user`,httpOptions).toPromise();
  }
  
}
