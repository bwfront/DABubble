import { Component } from '@angular/core';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';

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

  constructor(private dabubble: DabubbleappComponent){}

  createChannel() {
    console.log('Channel Created:', this.channel);

  }

  closePopUp(){
    this.dabubble.createChannelOpen = false;
  }
}
