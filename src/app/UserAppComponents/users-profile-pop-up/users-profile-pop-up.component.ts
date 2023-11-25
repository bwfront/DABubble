import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserProfileService } from 'src/app/services/userprofile.service';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';
import { ChannelService } from 'src/app/services/channel.service';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-users-profile-pop-up',
  templateUrl: './users-profile-pop-up.component.html',
  styleUrls: ['./users-profile-pop-up.component.sass'],
})
export class UsersProfilePopUpComponent implements OnDestroy {
  userName: string = '';
  userAvatar: string = '';
  userMail: string = '';
  uid: string = '';
  otherId: string = '';
  private userProfileSubscription: Subscription;

  constructor(
    private userProfileService: UserProfileService,
    private dabubble: DabubbleappComponent,
    private channelService: ChannelService,
    private chatService: ChatService,
    private local: LocalStorageService
  ) {
    this.userProfileSubscription = this.userProfileService
      .getUserProfileObservable()
      .subscribe((user) => {
        if (user) {
          this.setUserData(user);
        }
      });
  }

  setUserData(user: any) {
    this.userAvatar = user.avatarURl;
    this.userName = user.realName;
    this.userMail = user.email;
    this.otherId = user.uid;
    this.getUid();
  }

  closeProfile() {
    this.dabubble.usersProfilePopUpOpen = false;
  }

  ngOnDestroy() {
    this.userProfileSubscription.unsubscribe();
  }

  getUid() {
    let data = this.local.get('currentUser');
    this.uid = data.user.uid;
  }

  async sendMessage() {
    if (this.uid != this.otherId) {
      let element = await this.channelService.privateChat(this.uid, this.otherId);
      this.chatService.updateOpenChannel(element);
      this.dabubble.groupChat = false;
      this.dabubble.openChat();
      this.closeProfile()
    }
  }
}
