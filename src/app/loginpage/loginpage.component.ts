import { Component } from '@angular/core';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.sass']
})
export class LoginpageComponent {
  logincard: boolean = true;
  loginsuccesfull: boolean = false;
  
  passwordresetcard: boolean = true;

  imprintcard: boolean = false;
  privacycard: boolean = false;
}
