import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-profile-pop-up',
  templateUrl: './profile-pop-up.component.html',
  styleUrls: ['./profile-pop-up.component.sass']
})
export class ProfilePopUpComponent {

  constructor(private local: LocalStorageService, private authservice: AuthService, private router: Router){}

  userLogout(){
    this.local.remove('currentUser')
    this.authservice.logOut();
    this.router.navigate(['/']); 
  }

}
