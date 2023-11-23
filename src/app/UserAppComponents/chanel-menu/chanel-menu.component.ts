import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ChatService } from 'src/app/services/chat.service';
import { PrivatechatComponent } from '../privatechat/privatechat.component';

interface Channel {
  data: GroupChatData;
}

interface GroupChatData {
  chat_id: string;
  created_at: string; // String representation of a timestamp
  group_name: string;
  participants: string[]; // Array of user IDs as strings
  messages: Message[];
}

interface Message {
  message_id: string; // Assuming you have a message_id field
  sender_id: string;
  text: string;
  timestamp: string; // or Date if you convert the timestamp
}

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
    private local: LocalStorageService,
    private chatService: ChatService,
    private priateChat: PrivatechatComponent,
  ) {}

  ngOnInit() {
    this.loadChannels();
    this.loadUsers();
    this.getUid();
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

    if (this.channels.length > 0) {
      this.chatService.updateOpenChannel(this.channels[0]);
    } else {
      this.chatService.updateOpenChannel(null);
    }
  }

  openChannel(groupName: string) {
    this.channels.forEach((element) => {
      if (element.group_name == groupName) {
        this.chatService.updateOpenChannel(element);
        this.dabubble.groupChat = true;
      }
    });
  }

  async openPrivateChat(userId: string) {
    if (this.uid != userId) {
      let element = await this.channelService.privateChat(this.uid, userId);
      this.chatService.updateOpenChannel(element);
      this.dabubble.groupChat = false;
    }
  }

  loadUsers() {
    this.subscription.add(
      this.channelService.fetchData('users').subscribe((users) => {
        this.users = users;
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
