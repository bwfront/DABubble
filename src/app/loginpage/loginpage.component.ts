import { Component } from '@angular/core';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.sass']
})
export class LoginpageComponent {
  logincard: boolean = true;
  loginsuccesfull: boolean = false;
  
  passwordresetcard: boolean = false;

  imprintcard: boolean = false;
  privacycard: boolean = false;

  popuptext: string = '';

  showPopUpMessage(message: string){
    this.popuptext = message;
    this.loginsuccesfull = true;
    setTimeout(() => {
      this.loginsuccesfull = false;
    }, 3000);
  }
}
