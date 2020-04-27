import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from './services/authorization-service.service';
import { PartnerService } from './services/BusinessServices/Partner/partner.service';
import { Partner } from './models/BusinessModels/Partner/partner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'business-frontend';

  constructor(
    private authService: AuthorizationService,
    private partnerService: PartnerService
  ){
  }

  async ngOnInit(): Promise<void> {
    let part: Partner = await this.partnerService.getOwnCompany();
    if(part.id == null){
      this.authService.ownCompanyExists = false;
    }else{
      this.authService.ownCompanyExists = true;
    }
    console.log(this.authService.ownCompanyExists);
  }

  getAuthService(): AuthorizationService{
    return this.authService;
  }




}
