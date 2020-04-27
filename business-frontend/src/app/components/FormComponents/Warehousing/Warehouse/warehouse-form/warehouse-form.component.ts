import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { WarehouseService } from 'src/app/services/Warehousing/Warehouse/warehouse.service';
import { FormBuilder, FormControl, Validators, AbstractControl, Form, FormGroup, ValidatorFn } from '@angular/forms';
import { Stock } from 'src/app/models/Warehousing/Stock/stock';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Warehouse } from 'src/app/models/Warehousing/Warehouse/warehouse';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/models/BusinessModels/Product/product';
import { ProudctService } from 'src/app/services/BusinessServices/Product/proudct.service';
import { ConfdialogComponent, ConfirmationDialogText } from 'src/app/components/ConfirmationDialog/confdialog/confdialog.component';
import { StockService } from 'src/app/services/Warehousing/Stock/stock.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Employee } from 'src/app/models/Employee/employee';
import { Vehicle } from 'src/app/models/Warehousing/Vehicle/vehicle';
import { EmployeeService } from 'src/app/services/BusinessServices/Employee/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleService } from 'src/app/services/Warehousing/Vehicle/vehicle.service';
import { Observable, from } from 'rxjs';

export interface StockDialogData{
  isNew: boolean,
  warehouseId: number,
  stock: Stock,
}

@Component({
  selector: 'app-warehouse-form',
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.css']
})
export class WarehouseFormComponent implements OnInit {

  public detailedWarehouse: Warehouse = new Warehouse();

  public detailedWarehouseStockList: Stock[] = [];
  public vehicleList: Vehicle[] = [];
  public employeeList: Employee[] = [];

  public chosenStock: Stock;
  public isNewStock: boolean;

  public dataSource;
  public employeeSource;
  public vehicleSource;

  public navigationSubscription;

  constructor(
    private warehouseService: WarehouseService,
    private employeeService: EmployeeService,
    private vehicleServoce: VehicleService,
    private formBuilder: FormBuilder,

    public stockDialog: MatDialog,
    public employeeDialog: MatDialog,
    public vehicleDialog: MatDialog,
    public confDialog: MatDialog,

    private routing: Router,
    private route: ActivatedRoute,

    private _snackBar: MatSnackBar
  ) { 
    this.navigationSubscription = this.routing.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
   }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async params => {
      if(params.new == 'no'){
        this.detailedWarehouse = await this.warehouseService.getWarehouse(parseInt(params.id));
        this.detailedWarehouseStockList = this.detailedWarehouse.stockList;
        this.employeeList = this.detailedWarehouse.employeeList;
        this.vehicleList = this.detailedWarehouse.vehicleList;

        this.dataSource = new MatTableDataSource(this.detailedWarehouseStockList);
        this.employeeSource = new MatTableDataSource(this.employeeList);
        this.vehicleSource = new MatTableDataSource(this.vehicleList);
      }else{
        this.detailedWarehouse = new Warehouse();
        this.employeeList = [];
        this.vehicleList = [];
        this.detailedWarehouseStockList = [];
      }
    })

      this.dataSource.sort = this.sort;
      this.employeeSource.sort = this.sort;
      this.vehicleSource.sort = this.sort;

  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['productName', 'quantity', 'unit'];

  employeeColumns: string[] = ['name', 'delete'];

  vehicleColumns: string[] = ['manufacturer', 'licensePlate', 'delete'];

  warehouseForm = this.formBuilder.group({
    'zipCode': new FormControl(this.detailedWarehouse.zipCode, Validators.compose([
                                Validators.pattern("[0-9][0-9][0-9][0-9]"), 
                                Validators.required])),
    'city': new FormControl(this.detailedWarehouse.city, Validators.compose([
                                Validators.pattern("[A-Z][A-Za-z éűáúőóüöÉÁŰÚŐÓÜÖ.\-]*"), 
                                Validators.required,
                                Validators.maxLength(30)])),
    'street': new FormControl(this.detailedWarehouse.street, Validators.compose([
                                Validators.pattern("[A-Z][A-Za-z ÉÁŰÚŐÓÜÖéáűúőóüö.\-]*"),
                                Validators.required,
                                Validators.maxLength(30)])),
    'streetNumber': new FormControl(this.detailedWarehouse.streetNumber, Validators.compose([
                                Validators.pattern("[0-9]*"),
                                Validators.required,
                                Validators.maxLength(4)]))
  })

  get zipCode() { return this.warehouseForm.get('zipCode'); }
  get city() { return this.warehouseForm.get('city'); }
  get street() { return this.warehouseForm.get('street'); }
  get streetNumber() { return this.warehouseForm.get('streetNumber'); }

  openDialog(stock?: Stock): void {

    if(stock == null){
      this.chosenStock = new Stock();
      this.isNewStock = true;
    }else{
      this.chosenStock = stock;
      this.isNewStock = false;
    }

    const dialogRef = this.stockDialog.open(WarehouseFormStockDialog, {
      width: '500px',
      data: { isNew: this.isNewStock, stock: this.chosenStock, warehouseId: this.detailedWarehouse.id}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result.newStock != null){

        await this.warehouseService.insertStockIntoWarehouse(this.detailedWarehouse.id,result.newStock).then(res => {

          this._snackBar.open('Sikeresen létrehozta a készletet!','', {
            duration: 2000,
            panelClass: ['success']
          })

        }).catch(e => {

          this._snackBar.open('Hiba történt! Status:' + e.status,'', {
            duration: 5000,
            panelClass: ['error']
          })

        });

      }

      this.ngOnInit();

    })
  }

  openEmployeeDialog(){
    const dialogRef = this.employeeDialog.open(EmployeeSelectorDialog, {
      width: '500px',
      data: this.detailedWarehouse.id
    })
    dialogRef.afterClosed().subscribe(res =>{
      this.ngOnInit();
    })
  }

  openVehicleDialog(){
    const dialogRef = this.vehicleDialog.open(VehicleSelectorDialog, {
      width: '500px',
      data: this.detailedWarehouse.id
    })
    dialogRef.afterClosed().subscribe(res =>{
      this.ngOnInit();
    })
  }

  async saveWarehouse(): Promise<void>{

    if(this.detailedWarehouse.id == null){

      await this.warehouseService.createWarehouse(this.detailedWarehouse).then(result => {

        this.routing.navigate(['.'], { relativeTo: this.route, queryParams: { new: 'no', id: result.id }});

        this._snackBar.open('Sikeresen létrehozta a raktárat!','', {
          duration: 2000,
          panelClass: ['success']
        })

      }).catch(e => {

        this._snackBar.open('Valami hiba történt! ' + e.status,'', {
          duration: 2000,
          panelClass: ['error']
        })

      });

    }else{

      await this.warehouseService.updateWarehouse(this.detailedWarehouse).then(result => {

        this.detailedWarehouse = result;

        this._snackBar.open('Sikeresen módosította a raktárat!','', {
          duration: 2000,
          panelClass: ['success']
        })

      }).catch(e => {

        this._snackBar.open('Valami hiba történt! ' + e.status,'', {
          duration: 2000,
          panelClass: ['error']
        })

      });

    }

    this.ngOnInit();
  }

  async deleteWarehouse(): Promise<void>{
    let dialogData: ConfirmationDialogText = {top: 'Biztosan törli a raktárat?', 
                                              bottom: 'Figyelem! Ezzel törlődnek a készletek és az ehhez a raktárhoz tartozó utak is!'};

    const dialogRef = this.confDialog.open(ConfdialogComponent, {

      width: '300px',
      data: dialogData,

    }).afterClosed().subscribe(result => {

      if(result){
        this.warehouseService.deleteWarehouse(this.detailedWarehouse.id).then(res => {

          this._snackBar.open('Sikeresen törölte a raktárat!','', {
            duration: 2000,
            panelClass: ['success']
          })

        }).catch(e => {
          
          this._snackBar.open('Valami hiba történt! ' + e.status,'', {
            duration: 2000,
            panelClass: ['error']
          })

        })
      }

      this.routing.navigate(['/warehouses']);

    })
  }

  async unbindEmployee(employee: Employee): Promise<void>{
    await this.employeeService.unbindEmployee(employee).then(res => {

      this._snackBar.open('Sikerült törölni a raktárból!','',{
        duration: 2000,
        panelClass: ['success'],
      })

      this.ngOnInit();

    }).catch(e => {

      this._snackBar.open('Hiba történt! ' + e.status,'',{
        duration: 2000,
        panelClass: ['success'],
      })

    });
  }
  async unbindVehicle(vehicle: Vehicle): Promise<void>{
    await this.vehicleServoce.unbindVehicleFromWarehouse(vehicle).then(res => {

      this._snackBar.open('Sikerült törölni a raktárból!','',{
        duration: 2000,
        panelClass: ['success'],
      })

      this.ngOnInit();

    }).catch(e => {

      this._snackBar.open('Hiba történt! ' + e.status,'',{
        duration: 2000,
        panelClass: ['success'],
      })

    });
  }
}

@Component({
  selector: 'warehouse-form-stock-dialog',
  templateUrl: './warehouse-form-stock-dialog.html',
})
export class WarehouseFormStockDialog implements OnInit{

  public control: FormControl = new FormControl;

  public choosenProduct: Product;

  public temp: number;

  public products: Observable<Product[]> = null;

  constructor(
    public dialogRef: MatDialogRef<WarehouseFormStockDialog>,
    @Inject(MAT_DIALOG_DATA) public data: StockDialogData,
    private formBuilder: FormBuilder,
    private productService: ProudctService,
    private stockService: StockService,
    public confDialog: MatDialog,
    private _snackBar: MatSnackBar
  ){}

  async ngOnInit(): Promise<void>{

    this.stockForm.get('product').valueChanges.subscribe(
      async val => {
        if(val == ' '){
          this.products = await from(this.productService.getProducts());
        }else{
          this.products = await from(this.productService.getProductsByInput(val));
        }
      }
    );

  }

  displayFn(val: Product) {
    return val ? val.productName + " C: " + val.code : val;
  }
  
  stockForm = new FormGroup({
    'product': new FormControl (this.data.stock.product, Validators.compose([
                                  Validators.required,
                                  Validators.maxLength(30),
                                  this.validateProduct])),
    'quantity': new FormControl (this.data.stock.quantity, Validators.compose([
                                  Validators.pattern("[0-9]*"),
                                  Validators.required,
                                  Validators.maxLength(7)])),
    'unit': new FormControl (this.data.stock.unit, Validators.compose([
                                  Validators.required,
                                  Validators.maxLength(10)])),
  })

  get product() { return this.stockForm.get('product'); }
  get quantity() { return this.stockForm.get('quantity'); }
  get unit() { return this.stockForm.get('unit'); }
  
  validateProduct(control: AbstractControl){
    if(control.value == null){
      return {noProduct: true};
    }
    if(control.value.id != null){
      return null;
    }else{
      return {noProduct: true};
    }
  }

  /*
  validateProduct(): ValidatorFn {
    return async (control: AbstractControl): Promise<{[key: string]: any} | null> => {
      let prod = control.value.trim();
      console.log(prod);
      if(prod == ''){
        return {'noProduct': true}
      }else{
        let foundProduct = await this.productService.getProductByName(prod);
        return foundProduct == null ?
          null : {'noProduct': true}
    }
    };
  }*/

  openConfDialog(){

    let dialogData: ConfirmationDialogText = {top: 'Biztosan törli a készletet?', 
                                              bottom: ''};

    const dialogRef = this.confDialog.open(ConfdialogComponent,{

      width: '300px',
      data: dialogData,

    });

    dialogRef.afterClosed().subscribe(async result => {

      if(result){
       await  this.stockService.deleteStock(this.data.stock.id).then(() => {
          
        this._snackBar.open('Sikeresen törölte a készletet!','',{
          duration: 2000,
          panelClass: ['success']
        })

        this.dialogRef.close({newStock: null});

        });
      }

    })
  }

  async saveStock(): Promise<void>{

    if(this.data.isNew){

      this.dialogRef.close({newStock: this.data.stock});

    }else{

      await this.stockService.updateStock(this.data.stock).then(res => {

        this._snackBar.open('Sikeresen módosította a készletet!','', {
          duration: 2000,
          panelClass: ['success'],
        })

        this.dialogRef.close({newStock: null});

      }).catch(e => {

        this._snackBar.open('Valami hiba történt! ' + e.status,'', {
          duration: 2000,
          panelClass: ['error'],
        })

      });

    }
  }

  public productComparisonFunction( product, value ) : boolean {
    return product.id === value.id;
  }

}


@Component({
  selector: 'warehouse-employee-select-dialog',
  templateUrl: './warehouse-employee-select-dialog.html',
})
export class EmployeeSelectorDialog implements OnInit{

  public freeWorkers: Employee[] = [];

  public selectedOptions: Employee[] = [];

  constructor(
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<EmployeeSelectorDialog>,
    private warehouseService: WarehouseService,
    private _snackBar: MatSnackBar
  ){}

  async ngOnInit(): Promise<void>{
    this.freeWorkers = await this.employeeService.getFreeWorkers();
  }

  saveWorkers(): void{
    this.selectedOptions.forEach(async opt => {
      await this.warehouseService.insertEmployeeIntoWarehouse(this.data,opt).catch(e => {

        this._snackBar.open('Valami nem sikerült :( Status: ' + e.status,'',{
          duration: 5000,
          panelClass: ['error'],
        })

        return;
      });
    })

    this._snackBar.open('Sikerült hozzáadni a dolgozókat!','',{
      duration: 2000,
      panelClass: ['success'],
    })

    this.dialogRef.close()
  }

}

@Component({
  selector: 'warehouse-vehicle-selector-dialog',
  templateUrl: './warehouse-vehicle-selector-dialog.html',
})
export class VehicleSelectorDialog implements OnInit{
  
  public freeVehicles: Vehicle[] = [];

  public selectedOptions: Vehicle[] = [];

  constructor(
    private vehicleService: VehicleService,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<VehicleSelectorDialog>,
    private warehouseService: WarehouseService,
    private _snackBar: MatSnackBar
  ){}

  async ngOnInit(): Promise<void>{
    this.freeVehicles = await this.vehicleService.getFreeVehicles();
  }

  saveVehicles(): void{
    this.selectedOptions.forEach(async opt => {

      await this.warehouseService.insertVehicleIntoWarehouse(this.data,opt).catch(e => {
        this._snackBar.open('Valami nem sikerült :( Status: ' + e.status,'',{
          duration: 5000,
          panelClass: ['error'],
        })

        return;

      });
    })

    this._snackBar.open('Sikerült hozzáadni a járműveket!','',{
      duration: 2000,
      panelClass: ['success'],
    })

    this.dialogRef.close()
  }

}
