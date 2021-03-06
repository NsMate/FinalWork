import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PartnerService } from 'src/app/services/BusinessServices/Partner/partner.service';
import { Partner } from 'src/app/models/BusinessModels/Partner/partner';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfdialogComponent, ConfirmationDialogText } from 'src/app/components/ConfirmationDialog/confdialog/confdialog.component';
import { AuthorizationService } from 'src/app/services/authorization-service.service';

@Component({
  selector: 'app-partner-form',
  templateUrl: './partner-form.component.html',
  styleUrls: ['./partner-form.component.css']
})
export class PartnerFormComponent implements OnInit {

  public detailedPartner: Partner = new Partner();

  public own: boolean = false;

  public ownCompany: Partner = new Partner();

  public companyName: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private partnerService: PartnerService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private routing: Router,
    private confDialog: MatDialog,
    private authService: AuthorizationService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      console.log(params);

      if(params == null){
        this.routing.navigate(['/partnerForm'],{queryParams: {new: 'yes'}});
      }

      if (params.own != null) {

        this.detailedPartner = await this.partnerService.getOwnCompany();
        this.own = true;

        if (this.detailedPartner == null) {
          this.detailedPartner = new Partner();
          this.detailedPartner.own = 1;
        }

      } else if(params.new == 'no'){

          try {

            this.detailedPartner = await this.partnerService.getPartner(parseInt(params.id));

          } catch (error) {
            
            this._snackBar.open('Nincs ilyen partner vagy rosszul adta meg az URL-t!','', {
              duration: 2000,
              panelClass: ['error'],
            })

            this.routing.navigate(['/partnerForm'],{queryParams: {new: 'yes'}});

          }
      }else{

        this.routing.navigate(['/partnerForm'],{queryParams: {new: 'yes'}});

      }

      this.companyName = this.detailedPartner.partnerName;

    })
  }

  async savePartner(): Promise<void> {
    if(this.detailedPartner.id == null){
      await this.partnerService.createPartner(this.detailedPartner).then(res => {

        this._snackBar.open('Sikeresen hozzáadta a partnert!','', {
          duration: 2000,
          panelClass: ['success'],
        })
        if(this.own){
          this.ngOnInit();
          this.authService.ownCompanyExists = true;
        }else{
          this.routing.navigate(['.'], { relativeTo: this.route, queryParams: { new: 'no', id: res.id }});
        }
        
      }).catch(e => {

        this._snackBar.open('Valami hiba történt! ' + e.status,'', {
          duration: 2000,
          panelClass: ['error'],
        })

      })
    }else{
      
      await this.partnerService.updatePartner(this.detailedPartner).then(res => {

        this._snackBar.open('Sikeresen módosította a partnert!','', {
          duration: 2000,
          panelClass: ['success'],
        })

        this.companyName = res.partnerName;
        this.detailedPartner = res;

      }).catch(e => {

        this._snackBar.open('Valami hiba történt! ' + e.status,'', {
          duration: 2000,
          panelClass: ['error'],
        })

      })
    }
  }

  async deletePartner(): Promise<void>{

    let dialogData: ConfirmationDialogText = {top: 'Biztosan törli a partnert?', 
                                              bottom: 'Figyelem! A partnerhez tartozó összes számla és rendelés is törlődik!'};

    const dialogRef = this.confDialog.open(ConfdialogComponent, {

      width: '250px',
      data: dialogData,

    }).afterClosed().subscribe(res => {

      if(res){

        this.partnerService.deletePartner(this.detailedPartner.id).then(res => {

          this._snackBar.open('Sikeresen törölte a partnert!','', {
            duration: 2000,
            panelClass: ['success'],
          })

          this.routing.navigate(['/partnerList']);

        }).catch(e => {

          this._snackBar.open('Valami hiba történt! ' + e.status,'', {
            duration: 2000,
            panelClass: ['error'],
          })
  
        })
      }
    })
  }

  partnerForm = this.formBuilder.group({
    'partnerName': new FormControl(this.detailedPartner.partnerName, Validators.compose([
                        Validators.required, 
                        Validators.pattern("[A-ZÁÉŰÚŐÓÜÖ1-9][a-záéíúőóüöű A-ZÁÉŰÚŐÓÜÖ \-.1-9]*"),
                        Validators.minLength(3),
                        Validators.maxLength(40)])),
    'zipCode': new FormControl(this.detailedPartner.zipCode, Validators.compose([
                        Validators.required, 
                        Validators.pattern("[0-9][0-9][0-9][0-9]")])),
    'city': new FormControl(this.detailedPartner.city, Validators.compose([
                        Validators.required, 
                        Validators.pattern("[A-ZÁÉŰÚŐÓÜÖ][a-záéíúőóüöű A-ZÁÉŰÚŐÓÜÖ \-]*"),
                        Validators.maxLength(40)])),
    'street': new FormControl(this.detailedPartner.street, Validators.compose([
                        Validators.required, 
                        Validators.pattern("[A-ZÁÉŰÚŐÓÜÖ1-9][a-záéíúőóüöű A-ZÁÉŰÚŐÓÜÖ \-.1-9]*"),
                        Validators.maxLength(40)])),
    'streetNumber': new FormControl(this.detailedPartner.streetNumber, Validators.compose([
                        Validators.required,
                        Validators.pattern("[1-9][0-9]*"),
                        Validators.maxLength(6)])),
    'contactFirstName': new FormControl(this.detailedPartner.contactFirstName, Validators.compose([
                        Validators.required, 
                        Validators.pattern("[A-ZÁÉŰÚŐÓÜÖ][a-záéíúőóüöű A-ZÁÉŰÚŐÓÜÖ \-]*"),
                        Validators.maxLength(30)])),
    'contactLastName': new FormControl(this.detailedPartner.contactLastName, Validators.compose([
                        Validators.required, 
                        Validators.pattern("[A-ZÁÉŰÚŐÓÜÖ][a-záéíúőóüöű A-ZÁÉŰÚŐÓÜÖ \-]*"),
                        Validators.maxLength(25)])),
    'contactEmail': new FormControl(this.detailedPartner.contactEmail, Validators.compose([
                        Validators.required,
                        Validators.email,
                        Validators.maxLength(30)])),
    'contactPhoneNumber': new FormControl(this.detailedPartner.contactPhoneNumber, Validators.compose([
                        Validators.required, 
                        Validators.pattern("[\+]?[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]")])),
    'vatNumber': new FormControl(this.detailedPartner.vatNumber, Validators.compose([
                        Validators.pattern("[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]-[0-9]-[0-9][0-9]"), 
                        Validators.required])),
    'partnershipType': new FormControl(this.detailedPartner.partnershipType, Validators.compose([
                        Validators.maxLength(30)])),
  })

  get partnerName() { return this.partnerForm.get('partnerName'); }
  get zipCode() { return this.partnerForm.get('zipCode'); }
  get city() { return this.partnerForm.get('city'); }
  get street() { return this.partnerForm.get('street'); }
  get streetNumber() { return this.partnerForm.get('streetNumber'); }
  get contactFirstName() { return this.partnerForm.get('contactFirstName'); }
  get contactLastName() { return this.partnerForm.get('contactLastName'); }
  get contactEmail() { return this.partnerForm.get('contactEmail'); }
  get contactPhoneNumber() { return this.partnerForm.get('contactPhoneNumber'); }
  get currencyType() { return this.partnerForm.get('currencyType'); }
  get vatNumber() { return this.partnerForm.get('vatNumber'); }
  get partnershipType() { return this.partnerForm.get('partnershipType'); }


}
