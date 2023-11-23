import { Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { ChatService } from 'src/app/services/chat.service';
import { DataService } from 'src/app/services/data.service';
import { ChannelService } from 'src/app/services/channel.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.sass'],
})
export class EditChannelComponent {
  name: string = '';
  description: string = '';
  channelId: string = '';
  currentChannel: any;
  createdby: any = '';
  editName: boolean = false;
  editDescription: boolean = false;
  constructor(
    private chat: ChatComponent,
    private chatService: ChatService,
    private data: DataService,
    private channel: ChannelService,
    private local: LocalStorageService
  ) {}

  ngOnInit() {
    this.initChannelInfo();
  }

  initChannelInfo() {
    this.currentChannel = this.chatService.currentChannel;
    this.name = this.currentChannel.group_name;
    this.description = this.currentChannel.description;
    this.channelId = this.currentChannel.id;
    this.getUserCreatesBy(this.currentChannel.createdby);
  }

  async getUserCreatesBy(userId: string) {
    try {
      const user = await this.data.getUserRef(userId);
      this.createdby = user?.realName;
    } catch (error) {
      this.createdby = "Nutzer nicht hinterlegt."
    }
  }

  changeChannelName() {
    this.channel.updateChannelName(this.channelId, this.name).then(() =>{
      this.editName = false
    })
  }

  changeChannelDescription() {
    this.channel.updateChannelDescription(this.channelId, this.description).then(() =>{
      this.editDescription = false
    })
  }

  leaveChannel(){
    this.channel.editParticipant(this.channelId, this.getUid(), false).then(() =>{
      this.closePopUp()
    })
  }

  getUid() {
    let data = this.local.get('currentUser');
    return data.user.uid;
  }
  closePopUp() {
    this.chat.openEditChannel = false;
  }
}
