import { Component } from '@angular/core';

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
  
  createChannel() {
    console.log('Channel Created:', this.channel);

  }
}
