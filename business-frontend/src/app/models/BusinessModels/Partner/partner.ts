import { BusinessOrder } from '../BusinessOrder/business-order';

export class Partner {
    id: number;
    partnerName: string = "";
    zipCode: number = null;
    city: string = "";
    street: string = "";
    streetNumber: number = null;
    contactFirstName: string = "";
    contactLastName: string = "";
    contactEmail: string = "";
    contactPhoneNumber: string = "";
    vatNumber: string = "";
    partnershipType: string = "";
    own: number = 0;
}
