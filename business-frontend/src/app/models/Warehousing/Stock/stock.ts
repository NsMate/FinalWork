import { Product } from '../../BusinessModels/Product/product';

export class Stock {
    id: number;
    quantity: number = 0;
    product: string = "";
    unit: string = "";
}
