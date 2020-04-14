import { Stock } from '../Stock/stock';
import { Vehicle } from '../Vehicle/vehicle';
import { Route } from '../Route/route';
import { Employee } from '../../Employee/employee';

export class Warehouse {
    id: number;
    zipCode: number = null;
    city: string = "";
    street: string = "";
    streetNumber: number = null;
    stockList: Stock[] = [];
    vehicleList: Vehicle[] = [];
    routeList: Route[] = [];
    employeeList: Employee[] = [];
}
