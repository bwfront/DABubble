import { Component } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { ThreadService } from 'src/app/services/thread.service';
import { UserProfileService } from 'src/app/services/userprofile.service';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';

@Component({
  selector: 'app-secondary-chat',
  templateUrl: './secondary-chat.component.html',
  styleUrls: ['./secondary-chat.component.sass'],
})
export class SecondaryChatComponent {
  uid: string = '';

  selectedMessage: any;
  currentChannel: any;

  messages: any[] = [];
  message: string = '';

  showEmojiPicker = false;
  pickerPosition = { top: '0px', left: '0px' };
  disableAutoScroll: boolean = false;

  editMessagePopUp: boolean = false;
  editTextArea: boolean = false;
  editMessageText: string = '';
  currentEditMessage: any;
  errorEdit: boolean = false;
  constructor(
    private threadS: ThreadService,
    private local: LocalStorageService,
    private data: DataService,
    private dabubble: DabubbleappComponent,
    private userProfileSevice: UserProfileService,
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
        console.log(this.selectedMessage, 'chatId', this.currentChannel);
      }
    });
  }

  closeThread(){
    this.dabubble.threadActive = false;
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

  hasUserReacted(reaction: any): boolean {
    return reaction.from.includes(this.uid);
  }

  onEmojiSelect(emoji: any) {}

  closeEmojiPicker() {
    this.showEmojiPicker = false;
  }

  openEditText(message: any) {}

  sendEditMessage() {}

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

  sendMessage(){}
}
