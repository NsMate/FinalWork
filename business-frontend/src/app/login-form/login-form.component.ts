import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../services/authorization-service.service';
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  hidePassword = true;

  form = this.formBuilder.group({
    username: ['', [ Validators.required ]],
    password: ['', [ Validators.required ]],
  });

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }

  constructor(
    private authService: AuthorizationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackbar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  async onSubmit() {
    try {
      await this.authService.login(this.username.value, this.password.value);
      if (this.authService.redirectUrl) {
        this.router.navigate([this.authService.redirectUrl]);
      } else {
        this.router.navigate(['/']);
      }

      this._snackbar.open("Sikeresen bejelentkezett!",'', {
        duration: 2000,
        panelClass: ["success"],
      })

    } catch (e) {

      this._snackbar.open("Hibás név vagy jelszó!",'', {
        duration: 2000,
        panelClass: ["error"],
      })

    }
  }

  getAuthService(): AuthorizationService{
    return this.authService;
  }
}
