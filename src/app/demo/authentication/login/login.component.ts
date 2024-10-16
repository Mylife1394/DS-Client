// angular import
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  public loginForm: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  userIsnotActive = false;
  userorpassInvalid = false;
  constructor(private formBuilder: FormBuilder){
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.authService.login(this.loginForm.value)
        .subscribe({
          next: (data: any) => {
            if (this.authService.isLoggedIn()) {
              this.router.navigate(['']);
            }
            console.log(data);
          },
          error: error => {
            if (error.status == 404) {
              console.log("نام کاربری یا کلمه عبور اشتباه است.");
              this.userorpassInvalid = true;
            }
            else {
              this.userIsnotActive = true;
              console.log(error);
            }
          }
        });
    }
  }
  // public method

}
