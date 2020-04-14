import { Product } from '../Product/product';

export class InvoiceItem {
    id: number;
    quantity: number = null;
    discount: number = null;
    product: string = "";
    description: string = "";
    unit: string = "";
    price: number = null;
}
