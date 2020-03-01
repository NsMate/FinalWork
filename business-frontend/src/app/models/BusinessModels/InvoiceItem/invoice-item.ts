import { Product } from '../Product/product';

export class InvoiceItem {
    id: number;
    quantity: number;
    discount: number;
    product: Product;
}
