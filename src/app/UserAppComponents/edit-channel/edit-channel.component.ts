import { Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.sass'],
})
export class EditChannelComponent {
  name: string = '';
  description: string = '';
  channelId: string= '';
  currentChannel: any;

  editName: boolean = false;
  editDescription: boolean = false;
  constructor(private chat: ChatComponent, private chatService: ChatService) {}

  leaveChannel() {}

  ngOnInit() {
    this.initChannelInfo();
  }
  
  initChannelInfo(){
    this.currentChannel = this.chatService.currentChannel;
    this.name = this.currentChannel.group_name;
    this.description = this.currentChannel.description;
    this.channelId = this.currentChannel.id;
  }

  changeChannelName(){

  }
  changeChannelDescription(){

  }

  closePopUp() {
    this.chat.openEditChannel = false;
  }
}
