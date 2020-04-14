import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Invoice } from 'src/app/models/BusinessModels/Invoice/invoice';
import { InvoiceItem } from 'src/app/models/BusinessModels/InvoiceItem/invoice-item';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private invoiceUrl:string = "http://localhost:8080/invoices";

  constructor(
    private http: HttpClient
  ) { }

  getInvoices(): Promise<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.invoiceUrl}`, httpOptions).toPromise();
  }

  getInvoices2(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.invoiceUrl}`, httpOptions);
  }

  getInvoice(id: number): Promise<Invoice> {
    return this.http.get<Invoice>(`${this.invoiceUrl}/${id}`, httpOptions).toPromise();
  }
  
  createInvoice(invoice: Invoice): Promise<Invoice> {
    return this.http.post<Invoice>(`${this.invoiceUrl}`, invoice, httpOptions).toPromise();
  }
  
  updateInvoice(invoice: Invoice): Promise<Invoice> {
    return this.http.put<Invoice>(`${this.invoiceUrl}/${invoice.id}`, invoice, httpOptions).toPromise();
  }
  
  deleteInvoice(id): Promise<Invoice> {
    return this.http.delete<Invoice>(`${this.invoiceUrl}/${id}`, httpOptions).toPromise();
  }

  getInvoiceItems(id: number): Promise<InvoiceItem[]> {
    return this.http.get<InvoiceItem[]>(`${this.invoiceUrl}/${id}/invoice_items`, httpOptions).toPromise();
  }

  insertItemToInvoice(id: number,invoiceItem: InvoiceItem): Promise<Invoice> {
    return this.http.post<Invoice>(`${this.invoiceUrl}/${id}/invoice_items`, invoiceItem, httpOptions).toPromise();
  }

  modifyItemOnInvoice(id: number,invoiceItems: InvoiceItem[]): Promise<Invoice> {
    return this.http.put<Invoice>(`${this.invoiceUrl}/${id}/invoice_items`, invoiceItems, httpOptions).toPromise();
  }
}
