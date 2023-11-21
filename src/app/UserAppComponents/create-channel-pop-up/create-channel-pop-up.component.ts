import { Component } from '@angular/core';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';
import { ChannelService } from 'src/app/services/channel.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-channel-pop-up',
  templateUrl: './create-channel-pop-up.component.html',
  styleUrls: ['./create-channel-pop-up.component.sass'],
})
export class CreateChannelPopUpComponent {
  uid: string = '';
  addUserForm: boolean = false;
  searchuser: string = '';
  users: any[] = [];
  channels: any[] = [];
  channel = {
    name: '',
    description: '',
    participants: [''],
  };
  selectedOption: any;

  private subscription: Subscription = new Subscription();
  constructor(
    private dabubble: DabubbleappComponent,
    private channelService: ChannelService,
    private local: LocalStorageService
  ) {}

  getUid() {
    let data = this.local.get('currentUser');
    return data.user.uid;
  }

  ngOnInit() {
    this.loadUsers();
    this.uid = this.getUid();
    this.loadChannels();
  }

  addUserToChannel(uid: string) {
    this.channel.participants.push(uid);
  }

  createChannel() {
    if (this.checkChannelExist()) {
      if (this.selectedOption === 'all') {
        this.channel.participants.push('all');
      } else {
        this.channel.participants.push(this.uid);
      }
      this.channelService.createChannel(this.channel).then(() => {
        this.closePopUp();
      });
    }
  }

  checkChannelExist() {
    for (let i = 0; i < this.channels.length; i++) {
      if (this.channels[i].group_name === this.channel.name) {
        // Error einfügen Pop Up Service?
        return false; // Wert wurde im Array gefunden, daher return false
      }
    }
    return true; // Wert wurde nicht im Array gefunden, daher return true
  }

  loadUsers() {
    this.subscription.add(
      this.channelService.fetchData('users').subscribe((users) => {
        this.checkUser(users);
      })
    );
  }

  checkUser(users: any[]) {
    const filteredUsers = users.filter((u) => u.data.uid != this.uid);
    console.log(filteredUsers);
    this.users = filteredUsers;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closePopUp() {
    this.addUserForm = false;
    this.dabubble.createChannelOpen = false;
  }

  loadChannels() {
    this.subscription.add(
      this.channelService.fetchData('group_chats').subscribe((channels) => {
        this.checkChannel(channels);
      })
    );
  }

  checkChannel(channels: any[]) {
    this.channels = [];
    channels.forEach((element) => {
      element.data.participants.forEach((participant: string) => {
        if (this.uid == participant || 'all' == participant) {
          this.channels.push({ ...element.data, id: element.id });
        }
      });
    });
  }
}
