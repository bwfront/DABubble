import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { SearchService } from 'src/app/services/search.service';
import { ChanelMenuComponent } from '../chanel-menu/chanel-menu.component';
import { ChannelService } from 'src/app/services/channel.service';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';
import { ChatService } from 'src/app/services/chat.service';
interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

interface Message {
  id: string;
  time: string;
  text: string;
  sender_id: string;
  timestamp: Timestamp;
  fileUrl: string;
  date: string;
  reactions: any[];
  fileType: string;
}

interface PrivateChat {
  id: string;
  created_at: Timestamp;
  userIds: string[];
  messages: Message[];
  searched?: Message;
  sender: string;
}
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.sass'],
})
export class SearchbarComponent {
  showSearchContent: boolean = false;
  searchmodel: string = '';
  uid: string = '';
  privateChat: any;
  channels: any;
  allChannels: any;
  searchedPrivateChat: PrivateChat[] = [];
  search: string = 'Suche nach Nachrichten';
  constructor(
    private SearchS: SearchService,
    private localS: LocalStorageService,
    private dataS: DataService,
    private channelService: ChannelService,
    private dabubble: DabubbleappComponent,
    private chatService: ChatService
  ) {}
  ngOnInit() {
    this.getUid();
    this.fetchData();
  }

  async fetchData() {
    if (this.searchmodel != '') {
      this.privateChat = await this.SearchS.fetchPrivateChat(this.uid);
      this.searchPrivateChat();
      this.searchChannels();
    } else {
      this.searchedPrivateChat = [];
      this.channels = [];
      this.search = 'Suche nach Nachrichten';
    }
  }

  async searchChannels() {
    this.SearchS.fetchChannels(this.uid).subscribe(async (channels) => {
      this.allChannels = channels;
      const filteredChannels = [];
      for (const channel of channels) {
        const messagePromises = channel.messages.map(async (message: any) => {
          if (
            message.text.toLowerCase().includes(this.searchmodel.toLowerCase())
          ) {
            message.sender = await this.getUserName(message.sender_id);
            return message;
          }
          return null;
        });
        const resolvedMessages = await Promise.all(messagePromises);
        const searchedM = resolvedMessages.filter((m) => m !== null);
        if (searchedM.length > 0) {
          filteredChannels.push({ ...channel, searchedM });
        }
      }
      this.channels = filteredChannels;
    });
    this.checkSearchFound();
  }

  async getUserName(docId: string) {
    try {
      const user = await this.dataS.getUserRef(docId);
      return user?.realName;
    } catch (error) {
      return null;
    }
  }

  async searchPrivateChat() {
    this.searchedPrivateChat = [];
    for (const pChat of this.privateChat) {
      for (const message of pChat.messages) {
        if (
          message.text.toLowerCase().includes(this.searchmodel.toLowerCase())
        ) {
          pChat.searched = message;
          const index = pChat.userIds.indexOf(this.uid);
          if (index > -1) {
            pChat.userIds.splice(index, 1);
          }
          if (pChat.userIds.length > 0) {
            pChat.sender = await this.getUserName(pChat.userIds[0]);
          } else {
            pChat.sender = null;
          }
          this.searchedPrivateChat.push(pChat);
        }
      }
    }
    this.checkSearchFound();
  }

  checkSearchFound() {
    if (this.channels.length == 0 && this.searchedPrivateChat.length == 0) {
      this.search = 'Keine Ergebnisse gefunden';
    } else {
      this.search = '';
    }
  }

  async openPrivateChat(userId: string, message: any) {
    if (userId != this.uid) {
      let element = await this.channelService.privateChat(this.uid, userId);
      this.chatService.updateOpenChannel(element);
      this.dabubble.groupChat = false;
      this.dabubble.openChat();
      this.chatService.triggerScrollToMessage(message);
      console.log(message);
    } else {
      let element = await this.channelService.openPrivateNotes(this.uid);
      this.chatService.updateOpenChannel(element);
      this.dabubble.groupChat = false;
      this.dabubble.openChat();

      this.chatService.triggerScrollToMessage(message);
    }
    this.searchmodel = '';
  }

  openChannel(groupName: string, message: any) {
    this.allChannels.forEach((element: any) => {
      element.data.id = element.id;
      if (element.data.group_name == groupName) {
        this.chatService.updateOpenChannel(element.data);
        this.dabubble.groupChat = true;
        this.dabubble.openChat();
        this.chatService.triggerScrollToMessage(message);
        console.log(message);
      }
    });
    this.searchmodel = '';
  }

  getUid() {
    let data = this.localS.get('currentUser');
    this.uid = data.user.uid;
  }
}
