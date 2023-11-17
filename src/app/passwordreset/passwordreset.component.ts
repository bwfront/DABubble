import { Component } from '@angular/core';
import { LoginpageComponent } from '../loginpage/loginpage.component';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.sass']
})
export class PasswordresetComponent {
  userEmail: string = '';

  constructor( private loginpage: LoginpageComponent) {}

  closepasswordcard(){
    this.loginpage.passwordresetcard = false;
  }

  userPasswordReset(){

  }
}
