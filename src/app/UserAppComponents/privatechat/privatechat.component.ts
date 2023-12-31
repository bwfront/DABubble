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
import { MessageParsingService } from 'src/app/services/parseMessage.service';
import { Subscription } from 'rxjs';
import { NewMessageService } from 'src/app/services/newMessage.service';

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
  uploadedFileUrl: string | null = null;
  uploadedFileType: string | null = null;
  uploadingFileName: string | null = null;
  uploadProgress: number = 0;
  isUploading: boolean = false;

  openLinkUser: boolean = false;
  users: any = [];

  autoScrollToBottom: boolean = true;
  private subscription = new Subscription();

  stringEmojis: any[] = [];
  constructor(
    private chatService: ChatService,
    private local: LocalStorageService,
    private data: DataService,
    private dabubble: DabubbleappComponent,
    private userProfileSevice: UserProfileService,
    private parseS: MessageParsingService,
    private newMessageS: NewMessageService
  ) {
    this.subscription.add(
      this.chatService.scrollToMessage$.subscribe((messageId) =>
        this.scrollToMessage(messageId)
      )
    );
  }

  loadFrequentEmojis() {
    const emojiData = localStorage.getItem('emoji-mart.frequently');
    if (emojiData) {
      const emojis = JSON.parse(emojiData);
      const sortedEmojis = Object.entries(emojis)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .map(([key]) => key)
        .slice(0, 2);
      this.stringEmojis = sortedEmojis;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.loadFrequentEmojis();
    this.setMessage();
    this.uid = this.getUid();
    this.chatService.openChannel.subscribe((channel) => {
      if (channel && channel.id) {
        this.setPrivateChatData(channel);
        this.currentId = channel.id;
        this.loadMessages();
      }
    });
  }

  setMessage() {
    this.message = this.newMessageS.getValue();
    this.newMessageS.newMessage = false;
    this.newMessageS.setValue('');
  }

  private scrollToMessage(message: any) {
    this.autoScrollToBottom = false;
    setTimeout(() => {
      const messageElement = document.getElementById(message.searched.id);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 500);
  }

  openLinkUserPopUp() {
    this.openLinkUser = !this.openLinkUser;
  }

  handleUserClick(user: any) {
    const usernameHtml = `@${user.data.realName}`;
    this.message += usernameHtml;
  }

  parseMessage(messageText: string) {
    return this.parseS.parseMessage(messageText);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      if (allowedTypes.includes(file.type)) {
        this.uploadingFileName = file.name;
        this.uploadProgress = 0;
        this.isUploading = true;
        this.chatService.uploadFile(file).subscribe((response) => {
          if (typeof response === 'number') {
            this.uploadProgress = response;
          } else {
            this.uploadedFileUrl = response;
            this.uploadedFileType = file.type.includes('image/')
              ? 'image'
              : 'pdf';
            this.isUploading = false;
          }
        });
      } else {
        alert('Nur PNG, JPG, JPEG, und PDF Datein sind Erlaubt.');
      }
    }
  }

  deletFile() {
    this.uploadedFileUrl = null;
    this.uploadedFileType = null;
    this.uploadingFileName = null;
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
    if (this.currentEditMessage != null) {
      this.chatService.reactToMessage(
        'private_chats',
        this.currentId,
        this.currentEditMessage.id,
        emoji,
        this.uid
      );
    } else {
      this.message += emoji;
    }
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
    if (this.editMessageText.trim() != '') {
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
    if (!this.disableAutoScroll) {
    }
  }

  checkEnterKey(event: KeyboardEvent, chat: string): void {
    if (event.key === 'Enter' && chat === 'chat') {
      event.preventDefault();
      this.sendMessage();
    }
    if (event.key === 'Enter' && chat === 'edit') {
      event.preventDefault();
      this.sendEditMessage();
    }
  }

  sendMessage() {
    if (this.message.trim() != '' || this.uploadedFileUrl != null) {
      this.chatService.sendMessage(
        this.currentId,
        this.getUid(),
        this.message,
        'private_chats',
        this.uploadedFileUrl,
        this.uploadedFileType
      );
    }
    this.message = '';
    this.uploadedFileUrl = null;
    this.uploadedFileType = null;
    this.openLinkUser = false;
  }

  loadMessages() {
    if (this.currentId) {
      this.messages = [];
      this.chatService
        .getMessages(this.currentId, 'private_chats')
        .subscribe(async (messages) => {
          this.messages = messages;
          await this.loadUserNamesForReactions(this.messages);
          this.getUserInformation();
          this.loadMessagesScroll();
        });
    }
  }

  loadMessagesScroll() {
    this.disableAutoScroll = false;
    const pendingMessage = this.chatService.getPendingScrollMessage();
    if (pendingMessage) {
      setTimeout(() => {
        this.scrollToMessage(pendingMessage);
        this.chatService.clearPendingScrollMessage();
      }, 300);
    }
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
