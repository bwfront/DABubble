import { Component } from '@angular/core';


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

  constructor() {}

  userLogin() {
    if (this.userEmail && this.userPassword) {

      console.log('Email:', this.userEmail, 'Password:', this.userPassword);
    }
  }
}