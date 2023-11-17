import { Component } from '@angular/core';
import { LoginpageComponent } from '../loginpage/loginpage.component';

@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.sass'],
})
export class PrivacypolicyComponent {
  constructor(private loginpage: LoginpageComponent) {}

  closePrivacy() {
    this.loginpage.privacycard = false;
  }
}
