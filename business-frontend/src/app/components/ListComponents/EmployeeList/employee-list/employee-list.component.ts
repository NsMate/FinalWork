import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { EmployeeService } from 'src/app/services/BusinessServices/Employee/employee.service';
import { Employee } from 'src/app/models/Employee/employee';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators, ValidatorFn, FormGroup, AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ConfdialogComponent, ConfirmationDialogText } from 'src/app/components/ConfirmationDialog/confdialog/confdialog.component';
import { AppUser } from 'src/app/models/AppUser/app-user';
import { AuthorizationService } from 'src/app/services/authorization-service.service';
import { query } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';

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
    private empService: EmployeeService,
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
  displayedColumns: string[] = ['id', 'name', 'phone', 'email', 'department', 'userButton'];

  showDetailedEmployee(employee?: Employee): void{
    if(employee == null){

      this.routing.navigate(["/employeeForm"],{queryParams: {new: 'yes'}})

    }else{

      this.routing.navigate(["/employeeForm"],{queryParams: {new: 'no', id:employee.id}})

    }
  }

  async openDialog(employee: Employee): Promise<void> {

    employee.appUser = await this.empService.getEmployeesUser(employee);

    if(employee.appUser == null){
      employee.appUser = new AppUser();
    }

    let data: AppUserDialogData = {employee: employee};

    const dialogRef = this.appUserDialog.open(AppUserDialog, {
      width: '500px',
      data: data,
    }).afterClosed().subscribe(res => {

      this.ngOnInit();

    });
  }
}

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
  selector: 'app-user-dialog',
  templateUrl: './app-user-dialog.html',
})
export class AppUserDialog implements OnInit{

  errorMatcher = new CrossFieldErrorMatcher();

  public appUser: AppUser;

  public passwordAgain: string = "";

  public hidePassword: boolean = true;

  public autoComplete: string = "";

  public showNewPassword: boolean;
  
  constructor(
    public dialogRef: MatDialogRef<AppUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AppUserDialogData,
    private formBuilder: FormBuilder,
    public confDialog: MatDialog,
    private authService: AuthorizationService,
    private _snackBar: MatSnackBar
  ){}

  async ngOnInit(): Promise<void> {
    if(this.data.employee.appUser.id == null){
      this.autoComplete = "new-password";
      this.data.employee.appUser = new AppUser();
    }else{
      this.autoComplete = "on";
      this.data.employee.appUser.appUserPassword = "11223344";
      this.passwordAgain = "11223344";
      this.userForm.controls['userPassword'].setValidators(null);
      this.showNewPassword = false;
    }
  }

  openConfDialog(){
    let dialogData: ConfirmationDialogText = {top: 'Biztosan törli a felhasználót?',
                                              bottom: 'Ezután a felhasználó már nem tud hozzáférni a rendszerhez!'};

    const dialogRef = this.confDialog.open(ConfdialogComponent,{
      width: '300px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        this.authService.deleteUser(this.data.employee.appUser.id).then(res => {

          this._snackBar.open('Sikeresen törölte a felhasználót!','', {
            duration: 2000,
            panelClass: ['success'],
          })

          this.dialogRef.close();
  
        }).catch(e => {
  
          this._snackBar.open('Hiba történt! ' + e.status, '', {
            duration: 5000,
            panelClass: ['error'],
          })
  
        });
      }
    })
  }

  userForm = new FormGroup({
    'userName': new FormControl(this.data.employee.appUser.appUserName, Validators.compose([
                                  Validators.required,
                                  Validators.pattern("[A-Za-zÁÉŰÚŐÓÜÖéáűúőóüö_.0-9 ]*")])),
    'userPassword': new FormControl(this.data.employee.appUser.appUserPassword, Validators.compose([
                                  Validators.required,
                                  Validators.minLength(5),
                                  Validators.pattern("[A-Za-zÁÉŰÚŐÓÜÖéáűúőóüö_.0-9 ]*")])),
    'userPasswordAgain': new FormControl(this.passwordAgain),
    'userRole': new FormControl(this.data.employee.appUser.appUserGroup, Validators.required)
  }, {validators: this.validatePassword.bind(this)})

  get userName() { return this.userForm.get('userName'); }
  get userPassword() { return this.userForm.get('userPassword'); }
  get userPasswordAgain() { return this.userForm.get('userPasswordAgain'); }
  get userRole() { return this.userForm.get('userRole'); }

  async saveUser(): Promise<void>{
    if(this.data.employee.appUser.id == null){

      await this.authService.registerUser(this.data.employee,this.data.employee.appUser).then(res => {

        this._snackBar.open('Sikeresen regisztrálta a felhasználót!','', {
          duration: 2000,
          panelClass: ['success'],
        })

      }).catch(e => {

        this._snackBar.open('Hiba történt! ' + e.status, '', {
          duration: 5000,
          panelClass: ['error'],
        })

      });;
      
    }else{
      
      if(this.showNewPassword){

        await this.authService.updateUserWithNewPassword(this.data.employee.appUser).then(res => {

          this._snackBar.open('Sikeresen frissítette a felhasználót!','', {
            duration: 2000,
            panelClass: ['success'],
          })
  
        }).catch(e => {
  
          this._snackBar.open('Hiba történt! ' + e.status, '', {
            duration: 5000,
            panelClass: ['error'],
          })
  
        });
      }else{

        await this.authService.updateUser(this.data.employee.appUser).then(res => {

          this._snackBar.open('Sikeresen frissítette a felhasználót!','', {
            duration: 2000,
            panelClass: ['success'],
          })
  
        }).catch(e => {
  
          this._snackBar.open('Hiba történt! ' + e.status, '', {
            duration: 5000,
            panelClass: ['error'],
          })
  
        });
      }
      
    }   
     
    this.dialogRef.close();
  }

  validatePassword(fg: FormGroup){ 
    const password = fg.get('userPassword').value;
    const passwordAgain = fg.get('userPasswordAgain').value; 
    return (password == passwordAgain || this.showNewPassword == false)
        ? null 
        : { wrongPassword: true }
  }

  newPasswordShow(): void{
    let dialogData: ConfirmationDialogText = {top: 'Biztosan megváltoztatja a jelszót?', bottom: ''};

    const dialogRef = this.confDialog.open(ConfdialogComponent, {
      width: '250px',
      data: dialogData,
    })
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.showNewPassword = true;
        this.data.employee.appUser.appUserPassword = '';
        this.passwordAgain = '';
        this.userForm.controls['userPassword'].setValidators([
          Validators.required,
          Validators.minLength(5),
          Validators.pattern("[A-Za-zÁÉŰÚŐÓÜÖéáűúőóüö_.0-9 ]*")]);
        dialogRef.close();
      }else{
        dialogRef.close();
      }
    })
  }
}