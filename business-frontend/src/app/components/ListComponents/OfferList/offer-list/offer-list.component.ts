import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/services/BusinessServices/Order/order.service';
import { BusinessOrder } from 'src/app/models/BusinessModels/BusinessOrder/business-order';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.css']
})
export class OfferListComponent implements OnInit {

  public businessOrders: BusinessOrder[] = [];

  public dataSource;

  constructor(
    private orderService: OrderService
  ) { }

  async ngOnInit(): Promise<void> {
    this.businessOrders = await this.orderService.getBusinessOrders();
    this.dataSource = new MatTableDataSource(this.businessOrders);
    this.dataSource.sort = this.sort;
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id', 'partner', 'creationDate', 'dueDate'];
}
