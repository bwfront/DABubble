import { Component, Injectable, Input } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ChannelService } from 'src/app/services/channel.service';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { DataService } from 'src/app/services/data.service';

interface User {
  uid: string;
  avatarURl: string;
  realName: string;
}

@Component({
  selector: 'app-add-users-pop-up',
  templateUrl: './add-users-pop-up.component.html',
  styleUrls: ['./add-users-pop-up.component.sass'],
})
export class AddUsersPopUpComponent {
  uid: string = '';
  name: string = '';
  searchuser: string = '';
  selectedOption: any;
  selectedUsers: User[] = [];
  filteredUsers: any[] = [];
  users: any[] = [];
  channel = {
    name: '',
    description: '',
    participants: [] as string[],
    createdby: this.getUid(),
  };
  currentChannel: any;

  @Input() showUsers: boolean = false;
  @Input() addUsers: boolean = false;
  private subscription: Subscription = new Subscription();
  constructor(
    private chat: ChatComponent,
    private channelService: ChannelService,
    private local: LocalStorageService,
    private chatService: ChatService,
    private data: DataService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.uid = this.getUid();
    this.currentChannel = this.chatService.currentChannel;
    this.name = this.currentChannel.group_name;
    this.currentParticipants();
  }

  currentParticipants() {
    this.currentChannel.participants.forEach((element: string) => {
      this.data.getUserRef(element).then((user) => {
        if (user) {
          this.addUserToChannel(user);
        }
      });
    });
  }

  closePopUp() {
    this.chat.showUser = false;
    this.chat.addUser = false;
    this.chat.openAddUserPop = false;
  }

  openAddUser(){
    this.chat.showUser = false;
    this.chat.addUser = true;
  }

  getUid() {
    let data = this.local.get('currentUser');
    return data.user.uid;
  }

  filterUsers() {
    if (!this.searchuser) {
      this.filteredUsers = this.users.filter(
        (u) => !this.selectedUsers.some((su) => su.uid === u.uid)
      );
    } else {
      this.filteredUsers = this.users.filter(
        (u) =>
          u.realName.toLowerCase().includes(this.searchuser.toLowerCase()) &&
          !this.selectedUsers.some((su) => su.uid === u.uid)
      );
    }
  }

  removeUser(userData: User) {
    this.selectedUsers = this.selectedUsers.filter(
      (user) => user.uid !== userData.uid
    );
    this.channel.participants = this.channel.participants.filter(
      (userId) => userId !== userData.uid
    );
    this.filteredUsers.push(userData);
  }

  addUserToChannel(userData: User) {
    if (!this.selectedUsers.find((user) => user.uid === userData.uid)) {
      this.selectedUsers.push(userData);
      this.channel.participants.push(userData.uid);
      this.filteredUsers = this.filteredUsers.filter(
        (userDataUID) => userDataUID.uid !== userData.uid
      );
      this.searchuser = '';
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
    const filteredUsers = users
      .map((u) => {
        return {
          uid: u.data.uid,
          avatarURl: u.data.avatarURl,
          realName: u.data.realName,
        };
      })
      .filter((u) => u.uid != this.uid);
    this.users = filteredUsers;
    this.filterUsers();
  }

  saveUsers() {
    this.channelService.updateChannelParticipants(
      this.currentChannel.id,
      this.channel.participants
    );
    this.closePopUp();
  }
}
