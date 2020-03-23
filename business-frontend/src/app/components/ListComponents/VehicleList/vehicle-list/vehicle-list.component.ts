import { Component, OnInit, ViewChild } from '@angular/core';
import { VehicleService } from 'src/app/services/Warehousing/Vehicle/vehicle.service';
import { Vehicle } from 'src/app/models/Warehousing/Vehicle/vehicle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  public vehicles: Vehicle[] = [];
  public dataSource;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  //CONSTRUCOR AND INIT
  constructor(
    private vehicleService: VehicleService
  ) { }

  async ngOnInit(): Promise<void> {
    this.vehicles = await this.vehicleService.getVehicles();
    this.dataSource = new MatTableDataSource(this.vehicles);
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = ['id', 'manufacturer', 'licensePlateNumber'];

}
