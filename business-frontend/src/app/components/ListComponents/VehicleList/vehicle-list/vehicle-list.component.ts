import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { VehicleService } from 'src/app/services/Warehousing/Vehicle/vehicle.service';
import { Vehicle } from 'src/app/models/Warehousing/Vehicle/vehicle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfdialogComponent } from 'src/app/components/ConfirmationDialog/confdialog/confdialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  /**
   * vehiclel hold all of the vehicle from the databse
   * datasource is used to pass the data to the material table
   */
  public vehicles: Vehicle[] = [];
  public dataSource;

  /**
   * 
   * @param vehicleService used to create, edit, delete vehicles, database actions
   * @param vehicleDialog popup dialog for creation, editing and deletion of vehicles
   * @param _snackBar used to inform the user of their actions success
   */
  constructor(
    private vehicleService: VehicleService,
    public vehicleDialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

    /**
     * loding in the vehicle from the database
     * passing the information to the material table, and adding the sort to the table
     */
  async ngOnInit(): Promise<void> {
    this.vehicles = await this.vehicleService.getVehicles();
    this.dataSource = new MatTableDataSource(this.vehicles);
    this.dataSource.sort = this.sort;
  }

  /**
   * Sort for the material table, and defining the columns to be displayed
   */

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id', 'manufacturer', 'licensePlateNumber', 'type'];

  /**
   * This function open a dialog for editing and creating a vehicle.
   * 
   */

  openDialog(vehicle?: Vehicle): void {

    let dialogData: DialogData = {isNew: null, vehicle: null};
    
    if(vehicle == null){
      dialogData.vehicle = new Vehicle();
      dialogData.isNew = true;
    }else{
      dialogData.vehicle = vehicle;
      dialogData.isNew = false;
    }

    const dialogRef = this.vehicleDialog.open(VehicleOverviewDialog, {
      width: '500px',
      data: dialogData,
    }).afterClosed().subscribe(res => {

      this.ngOnInit();

    });
  }

}


/**
 * Dialog component for editing and creating new vehicle.
 */

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
    public confDialog: MatDialog,
    private _snackBar: MatSnackBar
  ){}

  /**
   * Opens confirmation dialog before deleting a vehicle.
   */

  openConfDialog(){
    const dialogRef = this.confDialog.open(ConfdialogComponent,{
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){

       await  this.vehicleService.deleteVehicle(this.data.vehicle.id).then(() => {
          this.dialogRef.close();
          this._snackBar.open('Sikeresen törölte a járművet!','', {
            duration: 2000,
            panelClass: 'success', 
          })
        }).catch(e => {
          this._snackBar.open('Probléma merült fel :( ' + e.error,'', {
            duration: 5000,
            panelClass: 'error', 
          })
        });;
      }
    })

  }

  
  /**
   * This function is used to save the vehicle,
   * it determines if it is new or just updating is needed.
   */

  async savingVehicle(): Promise<void>{
    if(this.data.isNew){

      await this.vehicleService.createVehicle(this.data.vehicle).then(res => {
        this._snackBar.open('Sikeresen létrehozta a járművet!','', {
          duration: 2000,
          panelClass: 'success', 
        })
      }).catch(e => {
        this._snackBar.open('Probléma merült fel :( ' + e.error,'', {
          duration: 5000,
          panelClass: 'error', 
        })
      });

    }else{

      await this.vehicleService.updateVehicle(this.data.vehicle).then(res => {
        this._snackBar.open('Sikeresen módosította a járművet!','', {
          duration: 2000,
          panelClass: 'success', 
        })
      }).catch(e => {
        this._snackBar.open('Probléma merült fel :( ' + e.error,'', {
          duration: 5000,
          panelClass: 'error', 
        })
      });;
    }
    
    this.dialogRef.close();
  }

  /**
   * Form control and validators for the form on the dialog.
   */

  vehicleForm = this.formBuilder.group({
    'type': new FormControl (this.data.vehicle.vehicleType, Validators.required),
    'licensePlate': new FormControl (this.data.vehicle.licensePlateNumber, Validators.compose([Validators.pattern("[A-Z][A-Z][A-Z]-[0-9][0-9][0-9]"), Validators.required])),
    'manufacturer': new FormControl (this.data.vehicle.manufacturer, Validators.compose([Validators.required, Validators.pattern("[A-Za-zÉÁŰÚŐÓÜÖéáűúőóüö .\-]*")]))
  })

  get type() { return this.vehicleForm.get('type'); }
  get licensePlate() { return this.vehicleForm.get('licensePlate'); }
  get manufacturer() { return this.vehicleForm.get('manufacturer'); }

}
