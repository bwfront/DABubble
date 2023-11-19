import { Component } from '@angular/core';
import { AuthService } from 'src/app//services/auth.service';
import { LoginpageComponent } from '../loginpage/loginpage.component';

@Component({
  selector: 'app-registercard',
  templateUrl: './registercard.component.html',
  styleUrls: ['./registercard.component.sass'],
})
export class RegistercardComponent {
  passworderror: boolean = false;
  emailerror: boolean = false;
  emailinuse: boolean = false;

  userEmail: string = '';
  userPassword: string = '';
  userName: string = '';
  userPrivacy = false;

  userInfoFilled: boolean = false; //false

  avatarImages: Array<string> = [
    'https://firebasestorage.googleapis.com/v0/b/dabubble-1a43e.appspot.com/o/avatardefault%2F1.png?alt=media&token=999f5dc8-f3aa-4731-b480-6eb60aad210d',
    'https://firebasestorage.googleapis.com/v0/b/dabubble-1a43e.appspot.com/o/avatardefault%2F2.png?alt=media&token=2d3eb009-ed36-4119-91ca-535b0297f3a7',
    'https://firebasestorage.googleapis.com/v0/b/dabubble-1a43e.appspot.com/o/avatardefault%2F3.png?alt=media&token=2d3eb009-ed36-4119-91ca-535b0297f3a7',
    'https://firebasestorage.googleapis.com/v0/b/dabubble-1a43e.appspot.com/o/avatardefault%2F4.png?alt=media&token=2d3eb009-ed36-4119-91ca-535b0297f3a7',
    'https://firebasestorage.googleapis.com/v0/b/dabubble-1a43e.appspot.com/o/avatardefault%2F5.png?alt=media&token=2d3eb009-ed36-4119-91ca-535b0297f3a7',
    'https://firebasestorage.googleapis.com/v0/b/dabubble-1a43e.appspot.com/o/avatardefault%2F6.png?alt=media&token=2d3eb009-ed36-4119-91ca-535b0297f3a7',
  ];

  choosedAvatar: string = 'assets/images/profile/empty/default.png';

  constructor(
    private authService: AuthService,
    private loginpage: LoginpageComponent
  ) {}

  privacyopen() {
    this.loginpage.privacycard = true;
  }

  loginCardOpen() {
    this.loginpage.logincard = true;
  }

  registerUser() {
    if (this.userEmail && this.userPassword) {
      this.authService
        .signUp(
          this.userEmail,
          this.userPassword,
          this.userName,
          this.choosedAvatar
        )
        .then(() => {
          this.loginpage.logincard = true;
          this.loginpage.showPopUpMessage('Konto erfolgreich erstellt!');
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            this.emailinuse = true;
          }
          console.error('Register error:', error);
        });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.authService.uploadFile(file).subscribe(
        (url) => {
          this.choosedAvatar = url;
        },
        (error) => console.error('Error uploading file:', error)
      );
    }
  }

  toggleCheckbox() {
    this.userPrivacy = !this.userPrivacy;
  }
}
