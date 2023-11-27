import {
  AfterViewChecked,
  Component,
  ElementRef,
  Injectable,
  ViewChild,
} from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { Message } from 'src/app/models/message.model';
import { DataService } from 'src/app/services/data.service';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';
import { UserProfileService } from 'src/app/services/userprofile.service';
import { user } from '@angular/fire/auth';

interface MessageGroup {
  label: string;
  messages: Message[];
}
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass'],
})
export class ChatComponent implements AfterViewChecked {
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  groupName: string = '';
  channel: any;
  currentId: string = '';
  message: string = '';
  messages: Message[] = [];
  uid: string = '';
  messageGroups: MessageGroup[] = [];

  groupChat: boolean = true;

  openEditChannel: boolean = false;
  openAddUser: boolean = false;

  avatImg: string[] = [];
  avatLength: number = 0;

  constructor(
    private chatService: ChatService,
    private local: LocalStorageService,
    private data: DataService,
    private dabubble: DabubbleappComponent,
    private userProfileSevice: UserProfileService
  ) {}

  ngOnInit() {
    this.messages = [];
    this.chatService.openChannel.subscribe((channel) => {
      if (channel) {
        this.channel = channel;
        this.groupName = channel.group_name;
        this.currentId = channel.id;
        this.setAvatImg(channel.participants);
        this.loadMessages();
      } else {
        this.groupName = 'Erstellen Sie Ihren ersten Gruppenchat!';
      }
    });
    this.uid = this.getUid();
  }

  setAvatImg(users: string[]) {
    this.avatLength = users.length;
    this.avatImg = [];
    for (let i = 0; i < 3; i++) {
      if (users[i]) {
        this.data.getUserRef(users[i]).then((e) => {
          if (e) {
            this.avatImg.push(e.avatarURl);
          }
        });
      }
    }
  }

  getUid() {
    let data = this.local.get('currentUser');
    return data.user.uid;
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage() {
    if (this.message != '') {
      this.chatService.sendMessage(
        this.currentId,
        this.getUid(),
        this.message,
        'group_chats'
      );
    }
    this.message = '';
  }

  loadMessages() {
    if (this.currentId) {
      this.chatService
        .getMessages(this.currentId, 'group_chats')
        .subscribe((messages) => {
          this.messages = messages;
          this.getUserInformation();
        });
    }
    this.scrollToBottom();
  }

  async getUserInformation() {
    const messagePromises = this.messages.map(async (message) => {
      try {
        const user = await this.data.getUserRef(message.sender_id);
        return { ...message, name: user?.realName, avatar: user?.avatarURl };
      } catch (error) {
        console.error('Error fetching user data:', error);
        return { ...message };
      }
    });
    const augmentedMessages = await Promise.all(messagePromises);
    this.messages = augmentedMessages;
    this.messageGroups = this.processMessages(this.messages);
  }

  processMessages(messages: Message[]): MessageGroup[] {
    const groups: MessageGroup[] = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    messages.forEach((message) => {
      const messageDate = new Date(message.date);
      let label = formatDate(messageDate);

      if (formatDate(today) === label) {
        label = 'Today';
      } else if (formatDate(yesterday) === label) {
        label = 'Yesterday';
      }

      let group = groups.find((g) => g.label === label);
      if (!group) {
        group = { label, messages: [] };
        groups.push(group);
      }
      group.messages.push(message);
    });

    return groups.sort((a, b) => {
      if (a.label === 'Today') return 1;
      if (b.label === 'Today') return -1;
      if (a.label === 'Yesterday') return 1;
      if (b.label === 'Yesterday') return -1;
      return new Date(a.label) > new Date(b.label) ? 1 : -1;
    });
  }

  messageSendFrom(senderid: string) {
    if (this.uid == senderid) {
      return true;
    } else {
      return false;
    }
  }
  closeChat() {
    this.dabubble.openChat();
  }

  openUserProfile(uid: string) {
    this.dabubble.usersProfilePopUpOpen = true;
    this.userProfileSevice.getUserProfile(uid);
  }
}
