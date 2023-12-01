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

interface MessageGroup {
  label: string;
  messages: Message[];
}
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-privatechat',
  templateUrl: './privatechat.component.html',
  styleUrls: ['./privatechat.component.sass'],
})
export class PrivatechatComponent implements AfterViewChecked {
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  nameChat: string = '';
  avatarChat: string = '';
  otherUser: string = '';
  channel: any;
  currentId: string = '';
  message: string = '';
  messages: Message[] = [];
  uid: string = '';
  messageGroups: MessageGroup[] = [];
  groupChat: boolean = true;
  openEditChannel: boolean = false;
  notes: boolean = false;
  editMessagePopUp: boolean = false;
  editTextArea: boolean = false;
  editMessageText: string = '';
  currentEditMessage: any;
  errorEdit: boolean = false;

  showEmojiPicker = false;
  pickerPosition = { top: '0px', left: '0px' };
  disableAutoScroll: boolean = false;
  constructor(
    private chatService: ChatService,
    private local: LocalStorageService,
    private data: DataService,
    private dabubble: DabubbleappComponent,
    private userProfileSevice: UserProfileService
  ) {}

  private calculatePickerPosition(event: MouseEvent): { top: string, left: string } {
    const button = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();
    let top = rect.top + rect.height;
    let left = rect.left;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const pickerWidth = 365;
    const pickerHeight = 350;
    if (left + pickerWidth > windowWidth) {
      left = windowWidth - pickerWidth;
    }
    if (top + pickerHeight > windowHeight) {
      top = rect.top - pickerHeight;
    }
    if (left < 0) {
      left = 0;
    }
    return { top: `${top}px`, left: `${left}px` };
  }

  openEmojiPicker(event: MouseEvent, message: any) {
    this.currentEditMessage = message;
    this.disableAutoScroll = true;
    this.pickerPosition = this.calculatePickerPosition(event);
    this.showEmojiPicker = true;
  }

  quickReact(emoji: any, message: any){
    this.currentEditMessage = message;
    this.onEmojiSelect(emoji)
  }

  hasUserReacted(reaction: any): boolean {
    return reaction.from.includes(this.uid);
  }

  onEmojiSelect(emoji: any) {
    this.chatService.reactToMessage(
      'private_chats',
      this.currentId,
      this.currentEditMessage.id,
      emoji,
      this.uid
    );
    this.showEmojiPicker = false;
  }

  closeEmojiPicker() {
    this.showEmojiPicker = false;
  }

  ngOnInit() {
    this.chatService.openChannel.subscribe((channel) => {
      if (channel && channel.id) {
        this.setPrivateChatData(channel);
        this.currentId = channel.id;
      }
    });
    this.uid = this.getUid();
    this.loadMessages();
  }

  openEditText(message: any) {
    this.currentEditMessage = message;
    this.editMessageText = message.text;
    this.editMessagePopUp = false;
    this.editTextArea = true;
  }

  sendEditMessage() {
    if (this.editMessageText != '') {
      this.chatService.editMessage(
        'private_chats',
        this.currentId,
        this.currentEditMessage.id,
        this.editMessageText
      );
      this.editTextArea = false;
    } else {
      this.errorEditMessage();
    }
  }

  errorEditMessage() {
    this.errorEdit = true;
    setTimeout(() => {
      this.errorEdit = false;
    }, 3000);
  }

  setPrivateChatData(channel: any) {
    if (!channel || !channel.id) {
      return;
    }
    this.currentId = channel.id;
    this.getNameAvatar(channel);
    this.loadMessages();
  }

  getNameAvatar(channel: any) {
    if (channel.user) {
      this.data.getUserRef(channel.user).then((e) => {
        this.nameChat = e?.realName || '';
        this.avatarChat = e?.avatarURl || '';
      });
      this.notes = true;
    }
    if (!channel.user && channel.userIds) {
      channel.userIds.forEach((id: string) => {
        if (id != this.uid) {
          this.otherUser = id;
          this.data.getUserRef(id).then((e) => {
            this.nameChat = e?.realName || '';
            this.avatarChat = e?.avatarURl || '';
          });
        }
      });
      this.notes = false;
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
        'private_chats'
      );
    }
    this.message = '';
  }

  loadMessages() {
    if (this.currentId) {
      this.messages = [];
      this.chatService
        .getMessages(this.currentId, 'private_chats')
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

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private getLabel(messageDate: Date, today: Date, yesterday: Date): string {
    let label = this.formatDate(messageDate);
    if (this.formatDate(today) === label) {
      return 'Today';
    } else if (this.formatDate(yesterday) === label) {
      return 'Yesterday';
    }
    return label;
  }

  private findOrCreateGroup(
    groups: MessageGroup[],
    label: string
  ): MessageGroup {
    let group = groups.find((g) => g.label === label);
    if (!group) {
      group = { label, messages: [] };
      groups.push(group);
    }
    return group;
  }

  private sortGroups(a: MessageGroup, b: MessageGroup): number {
    if (a.label === 'Heute') return 1;
    if (b.label === 'Heute') return -1;
    if (a.label === 'Gestern') return 1;
    if (b.label === 'Gestern') return -1;
    return new Date(a.label) > new Date(b.label) ? 1 : -1;
  }

  processMessages(messages: Message[]): MessageGroup[] {
    const groups: MessageGroup[] = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    messages.forEach((message) => {
      const messageDate = new Date(message.date);
      const label = this.getLabel(messageDate, today, yesterday);
      const group = this.findOrCreateGroup(groups, label);
      group.messages.push(message);
    });

    return groups.sort(this.sortGroups);
  }

  messageSendFrom(senderid: string) {
    if (this.uid == senderid) {
      return true;
    } else {
      return false;
    }
  }

  openUserProfile(uid: string) {
    if (!this.notes) {
      this.dabubble.usersProfilePopUpOpen = true;
      this.userProfileSevice.getUserProfile(uid);
    } else {
      this.dabubble.usersProfilePopUpOpen = true;
      this.userProfileSevice.getUserProfile(this.uid);
    }
  }
}
