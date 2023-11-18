import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})
export class ProfileComponent {
  userdata: any;
  userName: string = '';
  userAvatar: string = '';

  uid: string = '';
  constructor(private local: LocalStorageService, private data: DataService) {}

  ngOnInit() {
    let user = this.local.get('currentUser');
    this.uid = user.user.uid;
    this.getUserData();
  }

  getUserData() {
    this.data
      .getUserRef(this.uid)
      .then((user) => {
        this.userdata = user;
        if (user) {
          this.setUserData(user);
        }
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }

  setUserData(user: any) {
    this.userName = user.realName;
    this.userAvatar = user.avatarURl;
  }
}
