import { InvoiceItem } from '../InvoiceItem/invoice-item';
import { Partner } from '../Partner/partner';

export class Invoice {
    id: number;
    issueDate: Date = new Date();
    dueDate: Date = new Date();
    invoiceDescription: string = "";
    invoiceItems: InvoiceItem[] = [];
    partner: Partner = null;
    vat: number = 27;
    paymentType: string = "";
}
