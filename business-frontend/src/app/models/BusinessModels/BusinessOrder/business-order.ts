import { OrderItem } from '../OrderItem/order-item';

export class BusinessOrder {
    id: number;
    dueDate: Date;
    createDate: Date;
    orderItems: OrderItem[];
}
