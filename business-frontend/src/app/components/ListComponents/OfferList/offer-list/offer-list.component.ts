import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/services/BusinessServices/Order/order.service';
import { BusinessOrder } from 'src/app/models/BusinessModels/BusinessOrder/business-order';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.css']
})
export class OfferListComponent implements OnInit {

  public businessOrders: BusinessOrder[] = [];

  public dataSource;

  constructor(
    private orderService: OrderService,
    private routing: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.businessOrders = await this.orderService.getBusinessOrders();
    this.dataSource = new MatTableDataSource(this.businessOrders);
    this.dataSource.sort = this.sort;
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id', 'partner', 'creationDate', 'dueDate', 'status'];

  openDetailedOrder(id?: number): void{

    if(id != null){

      this.routing.navigate(["/orderForm"],{queryParams: {new: 'no', id: id}});

    }else{

      this.routing.navigate(["/orderForm"],{queryParams: {new: 'yes'}});

    }
  }

  getOrderStatus(order: BusinessOrder): string{
    if(order.status == 'CLOSED'){
      return 'Lezárva';
    }else if(order.status == 'OPEN'){
      return 'Nyitott';
    }else{
      return 'Rendezve';
    }
  }
}
