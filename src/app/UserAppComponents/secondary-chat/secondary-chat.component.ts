import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ThreadService } from 'src/app/services/thread.service';
import { UserProfileService } from 'src/app/services/userprofile.service';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';
import { Answer } from 'src/app/models/answer.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-secondary-chat',
  templateUrl: './secondary-chat.component.html',
  styleUrls: ['./secondary-chat.component.sass'],
})
export class SecondaryChatComponent implements AfterViewChecked {
  ngAfterViewChecked() {
    if (!this.disableAutoScroll) {
      this.scrollToBottom();
    }
  }

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  uid: string = '';

  selectedMessage: any;
  currentChannel: any;

  replies: any;
  fetchedReplies: any;
  messages: any[] = [];
  message: string = '';
  repliesLength: number = 0;
  showEmojiPicker = false;
  pickerPosition = { top: '0px', left: '0px' };
  disableAutoScroll: boolean = false;
  editMessagePopUp: boolean = false;
  editTextArea: boolean = false;
  editMessageText: string = '';
  currentEditMessage: any;
  errorEdit: boolean = false;
  uploadedFileUrl: string | null = null;
  uploadedFileType: string | null = null;
  constructor(
    private threadS: ThreadService,
    private local: LocalStorageService,
    private data: DataService,
    private dabubble: DabubbleappComponent,
    private userProfileSevice: UserProfileService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.uid = this.getUid();
    this.getMessage();
  }

  getMessage() {
    this.threadS.selectedMessage.subscribe((infos: any) => {
      if (infos) {
        this.selectedMessage = infos.message;
        this.currentChannel = infos.channel;
        this.loadReplies(
          this.currentChannel.currentId,
          this.selectedMessage.id
        );
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      if (allowedTypes.includes(file.type)) {
        this.chatService.uploadFile(file).then((fileUrl) => {
          this.uploadedFileUrl = fileUrl;
          this.uploadedFileType = file.type.includes('image/') ? 'image' : 'pdf';
        })
      } else {
        alert('Only PNG, JPG, JPEG, and PDF files are allowed.');
      }
    }
  }

  sendMessage() {
    if (this.message != '' || this.uploadedFileUrl != null) {
      const answer: Answer = {
        sender_id: this.uid,
        text: this.message,
        date: this.chatService.getDate(),
        time: this.chatService.getTime(),
        timestamp: new Date(),
        edit: false,
        reactions: [],
      };
      this.threadS.sendMessage(
        this.currentChannel.currentId,
        this.selectedMessage.id,
        answer,
        this.uploadedFileUrl,
        this.uploadedFileType
      );
    }
    this.message = '';
    this.uploadedFileUrl = null;
    this.uploadedFileType = null;
  }

  loadReplies(chatId: string, messageId: string) {
    this.threadS.fetchReplies(chatId, messageId).subscribe(async (data) => {
      this.fetchedReplies = data;
      await this.loadUserNamesForReactions(this.fetchedReplies);
      this.getUserInformation();
      this.disableAutoScroll = true;
      this.scrollToBottom();
      console.log(this.fetchedReplies);
      
    });
  }

  async getUserInformation() {
    const messagePromises = this.fetchedReplies.map(async (message: any) => {
      try {
        const user = await this.data.getUserRef(message.sender_id);
        return { ...message, name: user?.realName, avatar: user?.avatarURl };
      } catch (error) {
        console.error('Error fetching user data:', error);
        return { ...message };
      }
    });
    const augmentedMessages = await Promise.all(messagePromises);
    this.replies = augmentedMessages;
    this.repliesLength = this.replies.length;
    this.sortRepliesByTimestamp();
  }

  sortRepliesByTimestamp() {
    if (!this.replies || this.replies.length === 0) {
      return;
    }
    this.replies.sort((a: any, b: any) => {
      const dateA = new Date(
        a.timestamp.seconds * 1000 + a.timestamp.nanoseconds / 1000000
      );
      const dateB = new Date(
        b.timestamp.seconds * 1000 + b.timestamp.nanoseconds / 1000000
      );
      return dateB.getTime() - dateA.getTime();
    });
  }

  private scrollToBottom(): void {
    try {
      if (!this.disableAutoScroll) {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  closeThread() {
    this.dabubble.closeThread();
  }

  messageSendFrom(senderid: string) {
    if (this.uid == senderid) {
      return true;
    } else {
      return false;
    }
  }
  getUid() {
    let data = this.local.get('currentUser');
    return data.user.uid;
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

  onEmojiSelect(emoji: any) {
    if(this.currentEditMessage != null){
      this.disableAutoScroll = true;
      this.threadS.reactToMessage(
        this.currentChannel.currentId,
        this.selectedMessage.id,
        this.currentEditMessage.id,
        emoji,
        this.uid
      );
    }else{
      this.message += emoji;
    }
    this.showEmojiPicker = false;
  }

  hasUserReacted(reaction: any): boolean {
    return reaction.from.includes(this.uid);
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
      this.threadS.editMessage(
        this.currentChannel.currentId,
        this.selectedMessage.id,
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
  openUserProfile(uid: string) {
    this.dabubble.usersProfilePopUpOpen = true;
    this.userProfileSevice.getUserProfile(uid);
  }
}
