import { Component, OnInit, ViewChild } from '@angular/core';
import { InvoiceService } from 'src/app/services/BusinessServices/Invoice/invoice.service';
import { Invoice } from 'src/app/models/BusinessModels/Invoice/invoice';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  public invoices: Invoice[] = [];

  public dataSource;

  constructor(
    private invoiceService: InvoiceService,
    private routing: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.invoices = await this.invoiceService.getInvoices();
    this.dataSource = new MatTableDataSource(this.invoices);
    this.dataSource.sort = this.sort;
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id', 'partner', 'creationDate', 'dueDate', 'status'];

  openDetailedInvoice(id?: number): void{

    if(id != null){

      this.routing.navigate(["/invoiceForm"],{queryParams: {new: 'no', id: id}});

    }else{

      this.routing.navigate(["/invoiceForm"],{queryParams: {new: 'yes'}});

    }
  }

  getInvoiceStatus(invoice: Invoice): string{
    if(invoice.status == 'CLOSED'){
      return 'Lezárva';
    }else if(invoice.status == 'OPEN'){
      return 'Nyitott';
    }else{
      return 'Rendezve';
    }
  }

}
