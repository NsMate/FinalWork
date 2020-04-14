import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { EmployeeService } from 'src/app/services/BusinessServices/Employee/employee.service';
import { Employee } from 'src/app/models/Employee/employee';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators, ValidatorFn, FormGroup, AbstractControl } from '@angular/forms';
import { ConfdialogComponent } from 'src/app/components/ConfirmationDialog/confdialog/confdialog.component';
import { AppUser } from 'src/app/models/AppUser/app-user';
import { AuthorizationService } from 'src/app/services/authorization-service.service';
import { query } from '@angular/animations';

export interface AppUserDialogData{
  employee: Employee
}

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  public employees: Employee[] = [];
  public employeeTableDatasource;

  constructor(
    private employeeService: EmployeeService,
    private routing: Router,
    private authService: AuthorizationService,
    public appUserDialog: MatDialog
  ) { }

  getAuthService(): AuthorizationService{
    return this.authService;
  }

  async ngOnInit(): Promise<void> {
    this.employees = await this.employeeService.getEmployees();
    this.employeeTableDatasource = new MatTableDataSource(this.employees);
    this.employeeTableDatasource.sort = this.sort;
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id', 'name', 'phone', 'email', 'department', 'icon', 'userButton'];

  showDetailedEmployee(employee?: Employee): void{
    if(employee == null){

      this.routing.navigate(["/employeeForm"],{queryParams: {new: 'yes'}})

    }else{

      this.routing.navigate(["/employeeForm"],{queryParams: {new: 'no', id:employee.id}})

    }
  }

  openDialog(employee: Employee): void {

    if(employee.appUser == null){
      employee.appUser = new AppUser();
    }

    const dialogRef = this.appUserDialog.open(AppUserDialog, {
      width: '500px',
      data: { employee: employee}
    }).afterClosed().subscribe(res => {
      this.ngOnInit();
    });
  }
}

@Component({
  selector: 'app-user-dialog',
  templateUrl: './app-user-dialog.html',
})
export class AppUserDialog{

  public appUser: AppUser;
  public passwordAgain: string;
  
  constructor(
    public dialogRef: MatDialogRef<AppUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AppUserDialogData,
    private formBuilder: FormBuilder,
    public confDialog: MatDialog,
    private authService: AuthorizationService
  ){}

  openConfDialog(){
    const dialogRef = this.confDialog.open(ConfdialogComponent,{
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        this.authService.deleteUser(this.data.employee.appUser.id);
        this.dialogRef.close();
      }
    })
  }

  userForm = this.formBuilder.group({
    'userName': new FormControl(this.data.employee.appUser.appUserName, Validators.required),
    'userPassword': new FormControl(this.data.employee.appUser.appUserPassword, Validators.required),
    'userPasswordAgain': new FormControl(this.passwordAgain),
    'userRole': new FormControl(this.data.employee.appUser.appUserGroup, Validators.required)
  }, {validators: this.valdiatePassword.bind(this)})

  get userName() { return this.userForm.get('userName'); }
  get userPassword() { return this.userForm.get('userPassword'); }
  get userRole() { return this.userForm.get('userRole'); }

  async saveUser(): Promise<void>{
    if(this.data.employee.appUser.id == null){
      await this.authService.registerUser(this.data.employee,this.data.employee.appUser);
    }else{
      await this.authService.updateUser(this.data.employee.appUser);
    }    
    window.location.reload();
  }

  valdiatePassword(fg: FormGroup){
    const password = fg.get('userPassword').value;
    const passwordAgain = fg.get('userPasswordAgain').value; 
    return password == passwordAgain || this.data.employee.appUser.id != null
        ? null 
        : { wrongPassword: true }
  }
}