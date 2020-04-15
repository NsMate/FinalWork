import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PartnerService } from 'src/app/services/BusinessServices/Partner/partner.service';
import { Partner } from 'src/app/models/BusinessModels/Partner/partner';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfdialogComponent } from 'src/app/components/ConfirmationDialog/confdialog/confdialog.component';

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
    private confDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      console.log(params);

      if (params.own != null) {

        this.detailedPartner = await this.partnerService.getOwnCompany();
        this.own = true;

        if (this.detailedPartner == null) {
          this.detailedPartner = new Partner();
          this.detailedPartner.own = 1;
        }

      } else {

        if (params.new == 'no') {
          this.detailedPartner = await this.partnerService.getPartner(parseInt(params.id));
        } else {
          this.detailedPartner = new Partner();
        }

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

    const dialogRef = this.confDialog.open(ConfdialogComponent, {
      width: '250px',
    }).afterClosed().subscribe(res => {

      if(res){

        this.partnerService.deletePartner(this.detailedPartner.id).then(res => {

          this._snackBar.open('Sikeresen törölte a partnert!','', {
            duration: 2000,
            panelClass: ['success'],
          })

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
    'partnerName': new FormControl(this.detailedPartner.partnerName, Validators.compose([Validators.required, Validators.pattern("[A-ZÁÉŰÚŐÓÜÖ1-9][a-záéíúőóüöű A-ZÁÉŰÚŐÓÜÖ \-.1-9]*")])),
    'zipCode': new FormControl(this.detailedPartner.zipCode, Validators.compose([Validators.required, Validators.pattern("[0-9][0-9][0-9][0-9]")])),
    'city': new FormControl(this.detailedPartner.city, Validators.compose([Validators.required, Validators.pattern("[A-ZÁÉŰÚŐÓÜÖ][a-záéíúőóüöű A-ZÁÉŰÚŐÓÜÖ \-]*")])),
    'street': new FormControl(this.detailedPartner.street, Validators.compose([Validators.required, Validators.pattern("[A-ZÁÉŰÚŐÓÜÖ1-9][a-záéíúőóüöű A-ZÁÉŰÚŐÓÜÖ \-.1-9]*")])),
    'streetNumber': new FormControl(this.detailedPartner.streetNumber, Validators.compose([Validators.required,Validators.pattern("[1-9][0-9]*")])),
    'contactFirstName': new FormControl(this.detailedPartner.contactFirstName, Validators.compose([Validators.required, Validators.pattern("[A-ZÁÉŰÚŐÓÜÖ][a-záéíúőóüöű A-ZÁÉŰÚŐÓÜÖ \-]*")])),
    'contactLastName': new FormControl(this.detailedPartner.contactLastName, Validators.compose([Validators.required, Validators.pattern("[A-ZÁÉŰÚŐÓÜÖ][a-záéíúőóüöű A-ZÁÉŰÚŐÓÜÖ \-]*")])),
    'contactEmail': new FormControl(this.detailedPartner.contactEmail, Validators.compose([Validators.required,Validators.email])),
    'contactPhoneNumber': new FormControl(this.detailedPartner.contactPhoneNumber, Validators.compose([Validators.required, Validators.pattern("[+]+[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]")])),
    'vatNumber': new FormControl(this.detailedPartner.vatNumber, Validators.compose([Validators.pattern("[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]-[0-9]-[0-9][0-9]"), Validators.required])),
    'partnershipType': new FormControl(this.detailedPartner.partnershipType, Validators.required),
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
