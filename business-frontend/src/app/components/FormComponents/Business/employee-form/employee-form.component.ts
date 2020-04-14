import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/BusinessServices/Employee/employee.service';
import { Employee } from 'src/app/models/Employee/employee';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfdialogComponent } from 'src/app/components/ConfirmationDialog/confdialog/confdialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {

  /**
   * The detailed employee hold the information of the employee,
   * and the isNew variable tells us if the employee is new.
   */

  public detailedEmployee: Employee = new Employee();

  public isNew: boolean;

  /**
   * Injecting the employee service for database operations,
   * form builder for the form,
   * activated route for the query parameters,
   * router for navigating components,
   * snackbar for to inform the user of their actions success.
   * 
   */

  constructor(
    private employeeService: EmployeeService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private confDialog: MatDialog
  ) { }

  /**
   * On initiation we check the paramter new if we are creating a
   * new employee or if not we are loading in from the database
   * using the id query paramter.
   */

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async params => {

      if(params.new == 'yes'){

        this.isNew = true;

      }else{

        this.detailedEmployee = await this.employeeService.getEmployee(parseInt(params.id));
        this.isNew = false;

      }
    })
  }

  /**
   * From here on we create the form control and add validators
   * to the inputs. 
   */

  employeeForm = this.formBuilder.group({
    'lastName': new FormControl(this.detailedEmployee.lastName, Validators.compose([Validators.required, Validators.pattern("[A-ZÁÉŰÚŐÓÜÖ][a-záéíúőóüöű A-ZÁÉŰÚŐÓÜÖ \-]*")])),
    'firstName': new FormControl(this.detailedEmployee.firstName, Validators.compose([Validators.required, Validators.pattern("[A-ZÁÉŰÚŐÓÜÖ][a-záéíúőóüöű]*")])),
    'email': new FormControl(this.detailedEmployee.email, Validators.compose([Validators.required,Validators.email])),
    'phoneNumber': new FormControl(this.detailedEmployee.phoneNumber, Validators.compose([Validators.required,Validators.pattern("[\+]*[0-9]{11,}")])),
    'department': new FormControl(this.detailedEmployee.department, Validators.required),
  })

  get lastName() { return this.employeeForm.get('lastName'); }
  get firstName() { return this.employeeForm.get('firstName'); }
  get email() { return this.employeeForm.get('email'); }
  get phoneNumber() { return this.employeeForm.get('phoneNumber'); }
  get department() { return this.employeeForm.get('department'); }

  /**
   * This function is used to create or update the detailed employee
   * based on the variable is new, which is decided on initiation.
   * 
   * After the creation or update the user is informed on the success or
   * failure of the action by a snackbar.
   */

  async saveEmployee(): Promise<void>{
    if(this.isNew){

      await this.employeeService.createEmployee(this.detailedEmployee).then(res => {
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: { new: 'no', id: res.id }});
        this._snackBar.open('Sikeresen hozzáadta a dolgozót!','', {
          duration: 2000,
          panelClass: ['success'],
        })
      }).catch(e => {
        this._snackBar.open('Valami probléma történt! ' + e.error ,'', {
          duration: 5000,
          panelClass: ['error'],
        })
      });

    }else{

      await this.employeeService.updateEmployee(this.detailedEmployee).then(res => {
        this.detailedEmployee = res;
        this._snackBar.open('Sikeresen frissítette a dolgozót!','', {
          duration: 2000,
          panelClass: ['success'],
        })
      }).catch(e => {
        this._snackBar.open('Valami probléma történt! ' + e.error ,'', {
          duration: 5000,
          panelClass: ['error'],
        })
      });
    }
  }

  deleteEmployee(): void{
    const dialogRef = this.confDialog.open(ConfdialogComponent, {
      
      width: '300px',

    }).afterClosed().subscribe(async res => {

      if(res){
        await this.employeeService.deleteEmployee(this.detailedEmployee.id).then(res => {
          this._snackBar.open('Sikeresen törölte a dolgozót!','', {
            duration: 2000,
            panelClass: ['success'],
          })

        }).catch(e => {

          this._snackBar.open('Valami probléma történt! ' + e.error ,'', {
            duration: 5000,
            panelClass: ['error'],
          })
        });

        this.router.navigate(['/employeeList']);
      }
    })
  }
}
