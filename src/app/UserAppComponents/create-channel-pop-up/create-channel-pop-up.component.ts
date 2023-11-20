import { Component } from '@angular/core';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';
import { ChannelService } from 'src/app/services/channel.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-create-channel-pop-up',
  templateUrl: './create-channel-pop-up.component.html',
  styleUrls: ['./create-channel-pop-up.component.sass'],
})
export class CreateChannelPopUpComponent {
  uid: string = '';
  channel = {
    name: '',
    description: '',
    participants: [this.getUid()],
  };

  constructor(
    private dabubble: DabubbleappComponent,
    private channelService: ChannelService,
    private local: LocalStorageService
  ) {
    
  }

  getUid() {
    let data = this.local.get('currentUser');
    return data.user.uid;

    
  }

  createChannel() {
    this.channelService.createChannel(this.channel).then(() => {
      this.closePopUp();
    });
  }

  closePopUp() {
    this.dabubble.createChannelOpen = false;
  }
}
