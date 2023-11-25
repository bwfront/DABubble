import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
  private userProfileSubscription: Subscription;

  constructor(
    private router: Router,
    private userProfileService: UserProfileService,
    private dabubble: DabubbleappComponent
  ) {
    // Subscribe to the UserProfileService
    this.userProfileSubscription = this.userProfileService.getUserProfileObservable().subscribe(user => {
      if (user) {
        this.setUserData(user);
      }
    });
  }

  setUserData(user: any) {
    this.userAvatar = user.avatarURl;
    this.userName = user.realName;
  }

  closeProfile() {
    this.dabubble.usersProfilePopUpOpen = false;
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.userProfileSubscription.unsubscribe();
  }
}
