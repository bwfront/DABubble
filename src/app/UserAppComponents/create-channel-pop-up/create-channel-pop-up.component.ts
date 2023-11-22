import { Component } from '@angular/core';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';
import { ChannelService } from 'src/app/services/channel.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { Subscription } from 'rxjs';

interface User {
  uid: string;
  avatarURl: string;
  realName: string;
}

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
  channelExistError: boolean = false;
  filteredUsers: any[] = [];
  channels: any[] = [];
  channel = {
    name: '',
    description: '',
    participants: [''],
  };
  selectedOption: any;
  selectedUsers: User[] = [];

  private subscription: Subscription = new Subscription();
  constructor(
    private dabubble: DabubbleappComponent,
    private channelService: ChannelService,
    private local: LocalStorageService
  ) {}


  addUserToChannel(userData: User) {
      if (!this.selectedUsers.find(user => user.uid === userData.uid)) {
          this.selectedUsers.push(userData);
          this.channel.participants.push(userData.uid)
          this.filteredUsers = this.filteredUsers.filter(userDataUID => userDataUID.uid !== userData.uid);
          this.searchuser = '';
      }
  }
  
  removeUser(userData: User) {
      this.selectedUsers = this.selectedUsers.filter(user => user.uid !== userData.uid);
      this.channel.participants = this.channel.participants.filter(userId => userId !== userData.uid);
      this.filteredUsers.push(userData)
  }


  getUid() {
    let data = this.local.get('currentUser');
    return data.user.uid;
  }

  ngOnInit() {
    this.loadUsers();
    this.uid = this.getUid();
    this.loadChannels();
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
        return false;
      }
    }
    return true;
  }

  openAddUserForm(){
    if(this.checkChannelExist()){
      this.addUserForm = true
    }else{
      this.channelExistError = true
      setTimeout(() =>
      {
        this.channelExistError = false
      }, 3000)
    }
  }

  loadUsers() {
    this.subscription.add(
      this.channelService.fetchData('users').subscribe((users) => {
        this.checkUser(users);
      })
    );
  }

  checkUser(users: any[]) {
    const filteredUsers = users.map((u) => {
      return {
        uid: u.data.uid,
        avatarURl: u.data.avatarURl,
        realName: u.data.realName
      };
    }).filter(u => u.uid != this.uid);
    this.users = filteredUsers;
    this.filterUsers();
  }

  filterUsers() {
    if (!this.searchuser) {
      this.filteredUsers = this.users.filter(u => !this.selectedUsers.some(su => su.uid === u.uid));
    } else {
      this.filteredUsers = this.users.filter(u => 
        u.realName.toLowerCase().includes(this.searchuser.toLowerCase()) &&
        !this.selectedUsers.some(su => su.uid === u.uid)
      );
    }
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
