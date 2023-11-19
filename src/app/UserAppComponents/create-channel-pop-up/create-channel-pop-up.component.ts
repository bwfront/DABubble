import { Component } from '@angular/core';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-create-channel-pop-up',
  templateUrl: './create-channel-pop-up.component.html',
  styleUrls: ['./create-channel-pop-up.component.sass'],
})
export class CreateChannelPopUpComponent {
  channel = {
    name: '',
    description: '',
  };

  constructor(private dabubble: DabubbleappComponent, private channelService: ChannelService){}

  createChannel() {
    this.channelService.createChannel(this.channel.name, this.channel.description).then(() =>
    {
      this.closePopUp()
    });
  }

  closePopUp(){
    this.dabubble.createChannelOpen = false;
  }
}
