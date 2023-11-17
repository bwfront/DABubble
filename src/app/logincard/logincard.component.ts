import { Component } from '@angular/core';
import { AuthService } from 'src/app//services/auth.service';
import { LoginpageComponent } from '../loginpage/loginpage.component';

@Component({
  selector: 'app-logincard',
  templateUrl: './logincard.component.html',
  styleUrls: ['./logincard.component.sass'],
})
export class LogincardComponent {
  passworderror: boolean = false;
  emailerror: boolean = false;

  userEmail: string = '';
  userPassword: string = '';

  constructor(private authService: AuthService, private loginpage: LoginpageComponent) {}

  userLogin() {
    if (this.userEmail && this.userPassword) {
      this.authService
        .signIn(this.userEmail, this.userPassword)
        .then((userCredential) => {
          console.log('Sign in as:', userCredential.user);
        })
        .catch((error) => {
          this.emailerror = true;
        });
    }
  }

  googleLogin(){
    this.authService.byGoogle()
  }

  passwordresetopen(){
    this.loginpage.passwordresetcard = true;
  }
}