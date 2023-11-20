import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';

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
  constructor(private chatService: ChatService, private local: LocalStorageService) {}

  ngOnInit() {
    this.chatService.openChannel.subscribe(channel => {
      if (channel) {
        this.channel = channel
        this.groupName = channel.group_name;
        this.currentId = channel.id
      } else {
        this.groupName = 'Erstellen Sie Ihren ersten Gruppenchat!';
      }
    });
  }

  getUid() {
    let data = this.local.get('currentUser');
    return data.user.uid;
  }

  sendMessage(){
    if(this.message != ''){
      this.chatService.sendMessage(this.currentId, this.getUid(),  this.message)
    }
    this.message = '';
  }
}