import { Product } from '../Product/product';

export class ProductGroup {
    id: number;
    groupName: string = "";
    description: string = "";
    productList: Product[] = [];
}
