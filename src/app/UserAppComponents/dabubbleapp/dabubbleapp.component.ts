import { Component } from '@angular/core';

@Component({
  selector: 'app-dabubbleapp',
  templateUrl: './dabubbleapp.component.html',
  styleUrls: ['./dabubbleapp.component.sass']
})
export class DabubbleappComponent {
  profilePopUpOpen: boolean = false;
  createChannelOpen: boolean = false;
  groupChat: boolean = true;
}
