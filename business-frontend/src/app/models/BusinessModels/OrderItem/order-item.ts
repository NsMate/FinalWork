import { Product } from '../Product/product';

export class OrderItem {
    id: number;
    quantity: number;
    discount: number;
    product: Product;
}
