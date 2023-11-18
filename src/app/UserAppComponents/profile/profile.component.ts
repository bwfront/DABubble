import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(
    private local: LocalStorageService,
    private data: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.reatUserData();
  }
  reatUserData() {
    if (this.local.get('currentUser')) {
      let user = this.local.get('currentUser');
      this.uid = user.user.uid;
      this.getUserData();
    } else {
      this.router.navigate(['/']);
    }
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
      .catch(() => {
        this.router.navigate(['/']);
      });
  }

  setUserData(user: any) {
    this.userName = user.realName;
    this.userAvatar = user.avatarURl;
  }
}
