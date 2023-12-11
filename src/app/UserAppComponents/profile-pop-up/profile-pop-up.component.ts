import { Component } from '@angular/core';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';
import { PopUpMenuComponent } from '../pop-up-menu/pop-up-menu.component';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile-pop-up',
  templateUrl: './profile-pop-up.component.html',
  styleUrls: ['./profile-pop-up.component.sass'],
})
export class ProfilePopUpComponent {
  name: string = '';
  mail: string = '';
  avatar: string = '';
  avatarURl: string = '';

  token: string = '';
  uid: string = '';

  guest: boolean = false

  editProfile: boolean = false;

  constructor(
    private popupmenu: PopUpMenuComponent,
    private router: Router,
    private local: LocalStorageService,
    private data: DataService,
    private auth: AuthService
  ) {}


  checkIfGuest(){
    if(this.uid === '1aVY765xdhSNcbygAZYyUm0eaBg2'){
      this.guest = true;
    }else{
      this.guest = false;
    }
  }
  
  ngOnInit() {
    this.getUserData();
  }

  closeProfile() {
    this.popupmenu.profilePopUpOpen = false;
  }

  getUserData() {
    let user = this.local.get('currentUser').user;
    this.name = user.displayName;
    this.mail = user.email;
    this.uid = user.uid;
    this.token = user;
    this.data.getUserRef(this.uid).then((user) => {
      if (user) {
        this.avatarURl = user.avatarURl;
      }
    });
    this.checkIfGuest()
  }

  changeUserInfo() {
    this.data.updateUserData(this.uid, this.name, this.mail)
    this.auth.changeEmail(this.mail).then(() => {
      this.auth.changeName(this.name).then(() => {
        this.auth.logOut();
        this.local.remove('currentUser');
        this.router.navigate(['/']);
      });
    });
  }
}
