import { Invoice } from '../Invoice/invoice';
import { BusinessOrder } from '../BusinessOrder/business-order';

export class Partner {
    id: number;
    partnerName: string;
    zipCode: number;
    city: string;
    street: string;
    streetNumber: number;
    contactFirstName: string;
    contactLastName: string;
    contactEmail: string;
    contactPhoneNumber: string;
    currencyType: string;
    partnershipType: string;
    invoices: Invoice[];
    orders: BusinessOrder[];
}
