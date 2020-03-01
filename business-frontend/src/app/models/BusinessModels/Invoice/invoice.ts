import { InvoiceItem } from '../InvoiceItem/invoice-item';

export class Invoice {
    id: number;
    issueDate: Date;
    dueDate: Date;
    invoiceDescription: string;
    invoiceItems: InvoiceItem[];
}
