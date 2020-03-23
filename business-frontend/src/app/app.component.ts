import { Component } from '@angular/core';
import { AuthorizationService } from './services/authorization-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'business-frontend';

  constructor(
    private authService: AuthorizationService
  ){}

  getAuthService(): AuthorizationService{
    return this.authService;
  }
}
