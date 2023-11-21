import { Component } from '@angular/core';
import { AuthService } from 'src/app//services/auth.service';
import { LoginpageComponent } from '../loginpage/loginpage.component';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logincard',
  templateUrl: './logincard.component.html',
  styleUrls: ['./logincard.component.sass'],
})
export class LogincardComponent {
  passworderror: boolean = false;
  emailerror: boolean = false;
  loginError: boolean = false;

  userEmail: string = '';
  userPassword: string = '';

  constructor(private authService: AuthService, private loginpage: LoginpageComponent, private local: LocalStorageService, private router: Router) {}

  userLogin() {
    if (this.userEmail && this.userPassword) {
      this.authService
        .signIn(this.userEmail, this.userPassword)
        .then((userCredential) => {
          this.router.navigate(['/dabubble']);
          this.local.set('currentUser', userCredential)
        })
        .catch((error) => {
          this.loginError = true;
          setTimeout(() =>{
            this.loginError = false;
          },3000)
        });
    }
  }

  googleLogin(){
    this.authService.byGoogle()
  }

  passwordresetopen(){
    this.loginpage.passwordresetcard = true;
  }

  guestLogin(){
    this.userEmail = 'gast@mail.com'
    this.userPassword= '123456'
    this.userLogin();
  }
}