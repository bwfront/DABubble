import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass'],
})
export class ChatComponent {
  groupName: string = '';
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.openChannel.subscribe(channel => {
      if (channel) {
        this.groupName = channel.group_name;
      } else {
        this.groupName = 'Erstellen Sie Ihren ersten Gruppenchat!';
      }
    });
  }
}