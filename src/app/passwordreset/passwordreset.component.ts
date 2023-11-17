import { Component } from '@angular/core';
import { LoginpageComponent } from '../loginpage/loginpage.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.sass'],
})
export class PasswordresetComponent {
  userEmail: string = '';

  constructor(
    private loginpage: LoginpageComponent,
    private authService: AuthService
  ) {}

  closepasswordcard() {
    this.loginpage.passwordresetcard = false;
  }

  userPasswordReset() {
    this.authService.resetPassword(this.userEmail).then(() => {
      this.loginpage.passwordresetcard = false;
      this.loginpage.logincard = true;
      this.loginpage.showPopUpMessage('E-Mail erfolgreich versendet!');
    }).catch(() =>
    {
      this.loginpage.logincard = true;
      this.loginpage.showPopUpMessage('E-Mail konnte nicht versendet werden!');
    });
  }
}
