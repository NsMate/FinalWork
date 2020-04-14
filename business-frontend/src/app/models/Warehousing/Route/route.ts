import { Warehouse } from '../Warehouse/warehouse';
import { Vehicle } from '../Vehicle/vehicle';

export class Route {
    id: number;
    routeType: string = "";
    warehouse: Warehouse = null;
    destination: string = '';
    deliveryDate: Date = new Date();
    vehicle: Vehicle = new Vehicle();
}
