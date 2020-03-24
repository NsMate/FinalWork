import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { VehicleService } from 'src/app/services/Warehousing/Vehicle/vehicle.service';
import { Vehicle } from 'src/app/models/Warehousing/Vehicle/vehicle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';

export interface DialogData{
  vehicle: Vehicle,
  isNew: boolean
}

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  public vehicles: Vehicle[] = [];
  public dataSource;
  public chosenVehicle: Vehicle;
  public newVehicle: boolean;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  //CONSTRUCOR AND INIT
  constructor(
    private vehicleService: VehicleService,
    public vehicleDialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    this.vehicles = await this.vehicleService.getVehicles();
    this.dataSource = new MatTableDataSource(this.vehicles);
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = ['id', 'manufacturer', 'licensePlateNumber', 'type'];

  openDialog(vehicle?: Vehicle): void {
    if(vehicle == null){
      this.chosenVehicle = new Vehicle();
      this.newVehicle = true;
    }else{
      this.chosenVehicle = vehicle;
      this.newVehicle = false;
    }
    const dialogRef = this.vehicleDialog.open(VehicleOverviewDialog, {
      width: '500px',
      data: { isNew: this.newVehicle, vehicle: this.chosenVehicle}
    });
  }

}


//Component for the dialog window for editing and new vehicles

@Component({
  selector: 'vehicle-overview-dialog',
  templateUrl: './vehicle-overview-dialog.html',
})
export class VehicleOverviewDialog{
  
  constructor(
    public dialogRef: MatDialogRef<VehicleOverviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private vehicleService: VehicleService,
    public routing: Router
  ){}

  async savingVehicle(): Promise<void>{
    if(this.data.isNew){
      await this.vehicleService.createVehicle(this.data.vehicle);
    }else{
      await this.vehicleService.updateVehicle(this.data.vehicle);
    }
    window.location.reload();
  }
}
