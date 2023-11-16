import { Component } from '@angular/core';
import { AuthService } from 'src/app//services/auth.service';

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

  userInfoFilled: boolean = true; //false

  avatarImages: Array<string> = [
    'assets/images/profile/default/1.png',
    'assets/images/profile/default/2.png',
    'assets/images/profile/default/3.png',
    'assets/images/profile/default/4.png',
    'assets/images/profile/default/5.png',
    'assets/images/profile/default/6.png',
  ];

  choosedAvatar: string = 'assets/images/profile/empty/default.png';

  constructor(private authService: AuthService) {}

  registerUser() {
    if (this.userEmail && this.userPassword) {
      this.authService
        .signUp(this.userEmail, this.userPassword, this.userName, this.choosedAvatar)
        .then((userCredential) => {
          console.log('Register in as:', userCredential.user);
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
      this.uploadFile(file);
    }
  }

  uploadFile(file: File) {

  }
}
