import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { WarehouseService } from 'src/app/services/Warehousing/Warehouse/warehouse.service';
import { Warehouse } from 'src/app/models/Warehousing/Warehouse/warehouse';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.css']
})
export class WarehouseListComponent implements OnInit {

  public warehouses: Warehouse[] = [];
  public dataSource;
  public selectedWarehouse: Warehouse;

  constructor(
    private warehouseService: WarehouseService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.warehouses = await this.warehouseService.getWarehouses();
    this.dataSource = new MatTableDataSource(this.warehouses);
    this.dataSource.sort = this.sort;
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id', 'zip', 'city', 'address'];

  openWarehouseForm(warehouse?: Warehouse): void{

    if(warehouse != null){
      
      this.router.navigate(["/warehouseForm"],{queryParams: {new: 'no', id: warehouse.id}});

    }else{

      this.router.navigate(["/warehouseForm"],{queryParams: {new: 'yes'}});

    }

  }
}
