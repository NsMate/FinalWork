import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Warehouse } from 'src/app/models/Warehousing/Warehouse/warehouse';
import { InvoiceItem } from 'src/app/models/BusinessModels/InvoiceItem/invoice-item';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class InvoiceItemService {

  private invoiceItemUrl:string = "http://localhost:8080/invoice_items";

  constructor(
    private http: HttpClient
  ) { }

  getInvoiceItems(): Promise<InvoiceItem[]> {
    return this.http.get<InvoiceItem[]>(`${this.invoiceItemUrl}`, httpOptions).toPromise();
  }

  getInvoiceItem(id: number): Promise<InvoiceItem> {
    return this.http.get<InvoiceItem>(`${this.invoiceItemUrl}/${id}`, httpOptions).toPromise();
  }
  
  createInvoiceItem(invoiceItem: InvoiceItem): Promise<InvoiceItem> {
    return this.http.post<InvoiceItem>(`${this.invoiceItemUrl}`, invoiceItem, httpOptions).toPromise();
  }
  
  updateInvoiceItem(invoiceItem: InvoiceItem): Promise<InvoiceItem> {
    return this.http.put<InvoiceItem>(`${this.invoiceItemUrl}/${invoiceItem.id}`, invoiceItem, httpOptions).toPromise();
  }
  
  deleteInvoiceItem(id): Promise<InvoiceItem> {
    return this.http.delete<InvoiceItem>(`${this.invoiceItemUrl}/${id}`, httpOptions).toPromise();
  }
}
