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
import { ThreadService } from 'src/app/services/thread.service';

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
  createAt: string = '';
  createby: string = '';
  createbyId: string = '';
  groupChat: boolean = true;
  openEditChannel: boolean = false;
  openAddUserPop: boolean = false;
  addUser: boolean = false;
  showUser: boolean = false;
  avatImg: string[] = [];
  avatLength: number = 0;
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
    private userProfileSevice: UserProfileService,
    private threadService: ThreadService
  ) {}

  ngOnInit() {
    this.messages = [];
    this.uid = this.getUid();
    this.chatService.openChannel.subscribe((channel) => {
      if (channel) {
        this.loadChannel(channel);
        this.createbyId = channel.createdby;
      }
    });
  }

  openThread(message: any) {
    const channelInfo = {
      currentId: this.currentId,
      groupName: this.groupName,
    }
    this.threadService.setSelectedMessage(message, channelInfo);
    this.dabubble.threadActive = true;
  }

  async loadUserNamesForReactions(messages: Message[]) {
    for (const message of messages) {
      for (const reaction of message.reactions) {
        const userNames = await Promise.all(
          reaction.from.map((uid: any) => this.getUserName(uid))
        );
        reaction.userNames = userNames;
      }
    }
  }

  async getUserName(uid: string): Promise<string> {
    const userData = await this.data.getUserRef(uid);
    return userData?.realName || 'Unbekannter Benutzer';
  }

  hasCurrentUserReacted(reactionFrom: string[]): boolean {
    return reactionFrom.includes(this.uid);
  }

  private calculatePickerPosition(event: MouseEvent): {
    top: string;
    left: string;
  } {
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

  quickReact(emoji: any, message: any) {
    this.currentEditMessage = message;
    this.onEmojiSelect(emoji);
  }

  hasUserReacted(reaction: any): boolean {
    return reaction.from.includes(this.uid);
  }

  onEmojiSelect(emoji: any) {
    this.chatService.reactToMessage(
      'group_chats',
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

  openEditText(message: any) {
    this.currentEditMessage = message;
    this.editMessageText = message.text;
    this.editMessagePopUp = false;
    this.editTextArea = true;
  }

  sendEditMessage() {
    if (this.editMessageText != '') {
      this.chatService.editMessage(
        'group_chats',
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

  loadChannel(channel: any) {
    this.channel = channel;
    this.groupName = channel.group_name;
    this.currentId = channel.id;
    this.createAt = this.formatDateFromTimestamp(
      channel.created_at.seconds,
      channel.created_at.nanoseconds
    );
    this.getUserCreatesBy(channel.createdby);
    this.setAvatImg(channel.participants);
    this.loadMessages();
  }
  async getUserCreatesBy(userId: string) {
    try {
      const user = await this.data.getUserRef(userId);
      if (user) {
        this.createby = user?.realName;
      }
    } catch (error) {
      this.createby = 'Nutzer nicht hinterlegt.';
    }
  }

  openAddUserPopUp() {
    this.addUser = true;
    this.openAddUserPop = true;
  }
  openShowUserPopUp() {
    this.showUser = true;
    this.openAddUserPop = true;
  }

  setAvatImg(users: string[]) {
    if (users) {
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
  }

  getUid() {
    let data = this.local.get('currentUser');
    return data.user.uid;
  }

  private scrollToBottom(): void {
    try {
      if (!this.disableAutoScroll) {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }
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

  async loadMessages() {
    if (this.currentId) {
      this.chatService
        .getMessages(this.currentId, 'group_chats')
        .subscribe(async (messages) => {
          this.messages = messages;
          await this.loadUserNamesForReactions(this.messages);
          this.getUserInformation();
          this.disableAutoScroll = false;
          this.scrollToBottom();
        });
    }
  }

  formatDateFromTimestamp(seconds: number, nanoseconds: number): string {
    const timestamp = seconds * 1000 + nanoseconds / 1000000;
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = date.toLocaleDateString('de-DE');
    if (date.toDateString() === today.toDateString()) {
      return 'Heute';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Gestern';
    } else {
      return 'am ' + formattedDate;
    }
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
    this.dabubble.usersProfilePopUpOpen = true;
    this.userProfileSevice.getUserProfile(uid);
  }
}
