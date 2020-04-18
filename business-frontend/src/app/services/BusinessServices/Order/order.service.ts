import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BusinessOrder } from 'src/app/models/BusinessModels/BusinessOrder/business-order';
import { OrderItem } from 'src/app/models/BusinessModels/OrderItem/order-item';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderUrl:string = "http://localhost:8080/business_orders";

  constructor(
    private http: HttpClient
  ) { }

  getBusinessOrders(): Promise<BusinessOrder[]> {
    return this.http.get<BusinessOrder[]>(`${this.orderUrl}`, httpOptions).toPromise();
  }

  getBusinessOrder(id: number): Promise<BusinessOrder> {
    return this.http.get<BusinessOrder>(`${this.orderUrl}/${id}`, httpOptions).toPromise();
  }
  
  createBusinessOrder(order: BusinessOrder): Promise<BusinessOrder> {
    return this.http.post<BusinessOrder>(`${this.orderUrl}`, order, httpOptions).toPromise();
  }
  
  updateBusinessOrder(order: BusinessOrder): Promise<BusinessOrder> {
    return this.http.put<BusinessOrder>(`${this.orderUrl}/${order.id}`, order, httpOptions).toPromise();
  }
  
  deleteBusinessOrder(id): Promise<BusinessOrder> {
    return this.http.delete<BusinessOrder>(`${this.orderUrl}/${id}`, httpOptions).toPromise();
  }

  getBusinessOrdersItems(id: number): Promise<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.orderUrl}/${id}/order_items`, httpOptions).toPromise();
  }

  insertItemToBusinessOrder(id: number,orderItem: OrderItem): Promise<BusinessOrder> {
    return this.http.post<BusinessOrder>(`${this.orderUrl}/${id}/order_items`, orderItem, httpOptions).toPromise();
  }

  modifyOrderOnBusinessOrder(id: number,orderItems: OrderItem[]): Promise<BusinessOrder> {
    return this.http.put<BusinessOrder>(`${this.orderUrl}/${id}/order_items`, orderItems, httpOptions).toPromise();
  }

  getClosedOrders(): Promise<BusinessOrder[]> {
    return this.http.get<BusinessOrder[]>(`${this.orderUrl}/closedOrders`, httpOptions).toPromise();
  }
}
