import { OrderItem } from '../OrderItem/order-item';
import { Partner } from '../Partner/partner';

export class BusinessOrder {
    id: number;
    dueDate: Date = new Date();
    createDate: Date = new Date();
    orderItems: OrderItem[] = [];
    partner: Partner = new Partner();
}
