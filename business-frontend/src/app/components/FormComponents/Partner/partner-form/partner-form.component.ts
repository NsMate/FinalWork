import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PartnerService } from 'src/app/services/BusinessServices/Partner/partner.service';
import { Partner } from 'src/app/models/BusinessModels/Partner/partner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-partner-form',
  templateUrl: './partner-form.component.html',
  styleUrls: ['./partner-form.component.css']
})
export class PartnerFormComponent implements OnInit {

  public detailedPartner: Partner = new Partner();
  public own: string = null;

  public ownCompany: Partner = new Partner();

  constructor(
    public formBuilder: FormBuilder,
    private partnerService: PartnerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.own = params.own;
      if(this.own != null){
        this.ownCompany = await this.partnerService.getOwnCompany();
        sessionStorage.removeItem("detailedPartnerId");
        console.log(this.ownCompany);
        if(this.ownCompany != null){
          this.detailedPartner = this.ownCompany;
        }
      }
      if(sessionStorage.getItem("detailedPartnerId") != null){
        this.detailedPartner = await this.partnerService.getPartner(parseInt(sessionStorage.getItem("detailedPartnerId")));
      } 
    })   
  }

  async savePartner(): Promise<void>{
    if(this.own != null){
      this.ownCompany = this.detailedPartner;
      this.ownCompany.own = 1;
      if(this.ownCompany.id == null){
        await this.partnerService.createPartner(this.ownCompany).then(result =>{
          this.ownCompany = result;
        });
      }else{
        await this.partnerService.updatePartner(this.ownCompany).then(result =>{
          this.ownCompany = result;
        });
      }
    }else{
      if(this.detailedPartner.id == null){
        await this.partnerService.createPartner(this.detailedPartner).then(result => {
          this.detailedPartner = result;
        });
      }else{
        await this.partnerService.updatePartner(this.detailedPartner).then(result =>{
          this.detailedPartner = result;
        });
      }
    }
  }

  partnerForm = this.formBuilder.group({
    'partnerName': new FormControl(this.detailedPartner.partnerName, Validators.compose([Validators.required, Validators.pattern("[A-ZÁÉŰÚŐÓÜÖ][a-záéíúőóüöű A-ZÁÉŰÚŐÓÜÖ \-]*")])),
    'zipCode': new FormControl(this.detailedPartner.zipCode, Validators.compose([Validators.required, Validators.pattern("[0-9][0-9][0-9][0-9]")])),
    'city': new FormControl(this.detailedPartner.city, Validators.compose([Validators.required])),
    'street': new FormControl(this.detailedPartner.street, Validators.compose([Validators.required])),
    'streetNumber': new FormControl(this.detailedPartner.streetNumber, Validators.required),
    'contactFirstName': new FormControl(this.detailedPartner.contactFirstName, Validators.required),
    'contactLastName': new FormControl(this.detailedPartner.contactLastName, Validators.required),
    'contactEmail': new FormControl(this.detailedPartner.contactEmail, Validators.required),
    'contactPhoneNumber': new FormControl(this.detailedPartner.contactPhoneNumber, Validators.required),
    'vatNumber': new FormControl(this.detailedPartner.vatNumber, Validators.compose([Validators.pattern("[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]-[0-9]-[0-9][0-9]"),Validators.required])),
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
  get partnershipType() { return this.partnerForm.get('partnershipType'); }


}
