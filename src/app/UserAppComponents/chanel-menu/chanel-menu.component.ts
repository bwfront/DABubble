import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';
import { LocalStorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-chanel-menu',
  templateUrl: './chanel-menu.component.html',
  styleUrls: ['./chanel-menu.component.sass'],
})
export class ChanelMenuComponent {
  channelOpen: boolean = true;
  usersChannelOpen: boolean = true;
  channels: any[] = [];
  users: any[] = [];
  uid: string = '';

  private subscription: Subscription = new Subscription();
  constructor(
    private channelService: ChannelService,
    private dabubble: DabubbleappComponent,
    private local: LocalStorageService
  ) {}

  ngOnInit() {
    this.loadChannels();
    this.loadUsers();
    this.getUid();
  }

  loadChannels() {
    this.subscription.add(
      this.channelService.fetchData('channels').subscribe((channels) => {
        this.channels = channels;
      })
    );
  }

  loadUsers() {
    this.subscription.add(
      this.channelService.fetchData('users').subscribe((users) => {
        this.users = users;
        console.log(users);
      })
    );
  }

  getUid() {
    let data = this.local.get('currentUser');
    this.uid = data.user.uid;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createChannelOpen() {
    this.dabubble.createChannelOpen = true;
  }
}
