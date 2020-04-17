import { Warehouse } from '../Warehouse/warehouse';
import { Vehicle } from '../Vehicle/vehicle';
import { Invoice } from '../../BusinessModels/Invoice/invoice';
import { BusinessOrder } from '../../BusinessModels/BusinessOrder/business-order';

export class Route {
    id: number;
    routeType: string = "";
    warehouse: Warehouse = null;
    destination: string = '';
    deliveryDate: Date = new Date();
    vehicle: Vehicle = new Vehicle();
    invoice: Invoice = null;
    order: BusinessOrder = null;
}
