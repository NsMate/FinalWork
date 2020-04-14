import { Product } from '../Product/product';

export class OrderItem {
    id: number;
    quantity: number = null;
    discount: number = null;
    product: string = "";
}
