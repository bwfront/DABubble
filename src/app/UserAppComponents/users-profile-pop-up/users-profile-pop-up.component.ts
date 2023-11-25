import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserProfileService } from 'src/app/services/userprofile.service';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';

@Component({
  selector: 'app-users-profile-pop-up',
  templateUrl: './users-profile-pop-up.component.html',
  styleUrls: ['./users-profile-pop-up.component.sass'],
})
export class UsersProfilePopUpComponent implements OnDestroy {
  userName: string = '';
  userAvatar: string = '';
  userMail: string = '';
  private userProfileSubscription: Subscription;

  constructor(
    private userProfileService: UserProfileService,
    private dabubble: DabubbleappComponent
  ) {
    this.userProfileSubscription = this.userProfileService.getUserProfileObservable().subscribe(user => {
      if (user) {
        this.setUserData(user);
      }
    });
  }

  setUserData(user: any) {
    this.userAvatar = user.avatarURl;
    this.userName = user.realName;
    this.userMail = user.email
  }

  closeProfile() {
    this.dabubble.usersProfilePopUpOpen = false;
  }

  ngOnDestroy() {
    this.userProfileSubscription.unsubscribe();
  }

  sendMessage(){
    
  }
}
