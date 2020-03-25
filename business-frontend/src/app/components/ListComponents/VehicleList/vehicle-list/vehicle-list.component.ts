import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { VehicleService } from 'src/app/services/Warehousing/Vehicle/vehicle.service';
import { Vehicle } from 'src/app/models/Warehousing/Vehicle/vehicle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfdialogComponent } from 'src/app/components/ConfirmationDialog/confdialog/confdialog.component';

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

  constructor(
    private vehicleService: VehicleService,
    public vehicleDialog: MatDialog
  ) { }


  async ngOnInit(): Promise<void> {
    this.vehicles = await this.vehicleService.getVehicles();
    this.dataSource = new MatTableDataSource(this.vehicles);
    this.dataSource.sort = this.sort;
  }

  //Sorting and column displaying for the mat-table
  //

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id', 'manufacturer', 'licensePlateNumber', 'type'];

  //Function for opening the dialog for new and exsiting vehicle

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
//
//

@Component({
  selector: 'vehicle-overview-dialog',
  templateUrl: './vehicle-overview-dialog.html',
})
export class VehicleOverviewDialog{
  
  constructor(
    public dialogRef: MatDialogRef<VehicleOverviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private vehicleService: VehicleService,
    private formBuilder: FormBuilder,
    public confDialog: MatDialog
  ){}

  openConfDialog(){
    const dialogRef = this.confDialog.open(ConfdialogComponent,{
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
       await  this.vehicleService.deleteVehicle(this.data.vehicle.id).then(() => {
          window.location.reload();
        });
      }
    })
  }

  
  //Function for saving or editing a vehicle

  async savingVehicle(): Promise<void>{
    if(this.data.isNew){
      await this.vehicleService.createVehicle(this.data.vehicle);
    }else{
      await this.vehicleService.updateVehicle(this.data.vehicle);
    }
    window.location.reload();
  }

  //Validation for the vehicle form
  //

  vehicleForm = this.formBuilder.group({
    'type': new FormControl (this.data.vehicle.vehicleType, Validators.required),
    'licensePlate': new FormControl (this.data.vehicle.licensePlateNumber, Validators.compose([Validators.pattern("[A-Z][A-Z][A-Z]-[0-9][0-9][0-9]"), Validators.required])),
    'manufacturer': new FormControl (this.data.vehicle.manufacturer, Validators.compose([Validators.required, Validators.pattern("[A-Za-z]*")]))
  })

  get type() { return this.vehicleForm.get('type'); }
  get licensePlate() { return this.vehicleForm.get('licensePlate'); }
  get manufacturer() { return this.vehicleForm.get('manufacturer'); }

}
