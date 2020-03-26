import { Component, OnInit, ViewChild } from '@angular/core';
import { WarehouseService } from 'src/app/services/Warehousing/Warehouse/warehouse.service';
import { Warehouse } from 'src/app/models/Warehousing/Warehouse/warehouse';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.css']
})
export class WarehouseListComponent implements OnInit {

  public warehouses: Warehouse[] = [];
  public dataSource;

  constructor(
    private warehouseService: WarehouseService
  ) { }

  async ngOnInit(): Promise<void> {
    this.warehouses = await this.warehouseService.getWarehouses();
    this.dataSource = new MatTableDataSource(this.warehouses);
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id', 'zip', 'city', 'address'];

}
