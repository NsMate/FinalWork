import { OrderItem } from '../OrderItem/order-item';
import { Partner } from '../Partner/partner';

export class BusinessOrder {
    id: number;
    issueDate: Date = new Date();
    dueDate: Date = new Date();
    orderDescription: string = "";
    orderItems: OrderItem[] = [];
    partner: Partner = null;
    vat: number = 27;
    paymentType: string = "Átutalás";
    status: string = "OPEN";
}
