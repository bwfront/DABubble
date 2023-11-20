import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { Message } from 'src/app/models/message.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass'],
})
export class ChatComponent {
  groupName: string = '';
  channel: any;
  currentId: string = '';
  message: string = '';
  messages: Message[] = [];
  constructor(
    private chatService: ChatService,
    private local: LocalStorageService,
    private data: DataService
  ) {}

  ngOnInit() {
    this.messages = [];
    this.chatService.openChannel.subscribe((channel) => {
      if (channel) {
        this.channel = channel;
        this.groupName = channel.group_name;
        this.currentId = channel.id;
        this.loadMessages();
      } else {
        this.groupName = 'Erstellen Sie Ihren ersten Gruppenchat!';
      }
    });
  }

  getUid() {
    let data = this.local.get('currentUser');
    return data.user.uid;
  }

  sendMessage() {
    if (this.message != '') {
      this.chatService.sendMessage(this.currentId, this.getUid(), this.message);
    }
    this.message = '';
  }

  loadMessages() {
    if (this.currentId) {
      this.chatService.getMessages(this.currentId).subscribe((messages) => {
        this.messages = messages;
        console.log(messages);
        this.getUserInformation();
      });
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
    console.log(this.messages);
    
  }
}
