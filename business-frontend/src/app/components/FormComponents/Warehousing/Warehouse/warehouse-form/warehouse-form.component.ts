import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { WarehouseService } from 'src/app/services/Warehousing/Warehouse/warehouse.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Stock } from 'src/app/models/Warehousing/Stock/stock';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Warehouse } from 'src/app/models/Warehousing/Warehouse/warehouse';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/models/BusinessModels/Product/product';
import { ProudctService } from 'src/app/services/BusinessServices/Product/proudct.service';
import { ConfdialogComponent } from 'src/app/components/ConfirmationDialog/confdialog/confdialog.component';
import { StockService } from 'src/app/services/Warehousing/Stock/stock.service';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/Employee/employee';
import { Vehicle } from 'src/app/models/Warehousing/Vehicle/vehicle';
import { EmployeeService } from 'src/app/services/BusinessServices/Employee/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleService } from 'src/app/services/Warehousing/Vehicle/vehicle.service';

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
  public dataSource;
  public chosenStock: Stock;
  public isNewStock: boolean;

  public employeeSource;
  public vehicleSource;

  constructor(
    private warehouseService: WarehouseService,
    private formBuilder: FormBuilder,

    public stockDialog: MatDialog,
    public employeeDialog: MatDialog,
    public vehicleDialog: MatDialog,

    private routing: Router
  ) { }

  async ngOnInit(): Promise<void> {
    if(sessionStorage.getItem("selectedWarehouseId") != null){
      this.detailedWarehouse = await this.warehouseService.getWarehouse(parseInt(sessionStorage.getItem("selectedWarehouseId")));
      this.detailedWarehouseStockList = this.detailedWarehouse.stockList;
      this.employeeList = this.detailedWarehouse.employeeList;
      this.vehicleList = this.detailedWarehouse.vehicleList;
      console.log(this.vehicleList);

      this.dataSource = new MatTableDataSource(this.detailedWarehouseStockList);
      this.employeeSource = new MatTableDataSource(this.employeeList);
      this.vehicleSource = new MatTableDataSource(this.vehicleList);

      this.dataSource.sort = this.sort;
      this.employeeSource.sort = this.sort;
      this.vehicleSource.sort = this.sort;
    }
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['productName', 'quantity', 'unit'];

  employeeColumns: string[] = ['name'];

  vehicleColumns: string[] = ['manufacturer', 'licensePlate'];

  warehouseForm = this.formBuilder.group({
    'zipCode': new FormControl(this.detailedWarehouse.zipCode, Validators.compose([Validators.pattern("[0-9][0-9][0-9][0-9]"), Validators.required])),
    'city': new FormControl(this.detailedWarehouse.city, Validators.compose([Validators.pattern("[A-Z][a-z]*"), Validators.required])),
    'street': new FormControl(this.detailedWarehouse.street, Validators.compose([Validators.pattern("[A-Z][a-z ]*"),Validators.required])),
    'streetNumber': new FormControl(this.detailedWarehouse.streetNumber, Validators.compose([Validators.pattern("[0-9]*"),Validators.required]))
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
        this.detailedWarehouseStockList.push(result.newStock);
        await this.warehouseService.insertStockIntoWarehouse(this.detailedWarehouse.id,result.newStock);
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
        this.routing.navigate(['/warehouses']);
      });

    }else{

      await this.warehouseService.updateWarehouse(this.detailedWarehouse);

    }

    this.ngOnInit();
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

  public products: Product[] = [];

  constructor(
    public dialogRef: MatDialogRef<WarehouseFormStockDialog>,
    @Inject(MAT_DIALOG_DATA) public data: StockDialogData,
    private formBuilder: FormBuilder,
    private productService: ProudctService,
    private stockService: StockService,
    public confDialog: MatDialog
  ){}

  async ngOnInit(): Promise<void>{
    this.products = await this.productService.getProducts();
  }
  
  stockForm = this.formBuilder.group({
    'productName': new FormControl (this.data.stock.product, Validators.required),
    'quantity': new FormControl (this.data.stock.quantity, Validators.compose([Validators.pattern("[0-9]*"),Validators.required])),
    'unit': new FormControl (this.data.stock.unit, Validators.required),
  })

  get productName() { return this.stockForm.get('productName'); }
  get quantity() { return this.stockForm.get('quantity'); }
  get unit() { return this.stockForm.get('unit'); }

  openConfDialog(){
    const dialogRef = this.confDialog.open(ConfdialogComponent,{
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
       await  this.stockService.deleteStock(this.data.stock.id).then(() => {
          window.location.reload();
        });
      }
    })
  }

  async saveStock(): Promise<void>{

    if(this.data.isNew){

      this.dialogRef.close({newStock: this.data.stock});

    }else{

      await this.stockService.updateStock(this.data.stock);
      this.dialogRef.close({newStock: null});

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
        })
        return;
      });
    })
    this._snackBar.open('Sikerült hozzáadni a dolgozókat!','',{
      duration: 2000,
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
        })
        return;
      });
    })
    this._snackBar.open('Sikerült hozzáadni a járműveket!','',{
      duration: 2000,
    })
    this.dialogRef.close()
  }

}
