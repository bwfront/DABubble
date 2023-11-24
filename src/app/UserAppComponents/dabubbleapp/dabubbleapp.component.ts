import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-dabubbleapp',
  templateUrl: './dabubbleapp.component.html',
  styleUrls: ['./dabubbleapp.component.sass'],
})
export class DabubbleappComponent {
  profilePopUpOpen: boolean = false;
  createChannelOpen: boolean = false;
  groupChat: boolean = true;
  chatActive: boolean = true;
  channelActive: boolean = true;
  windowWidth: number = 0;

  ngOnInit() {
    this.checkWindowSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkWindowSize();
  }

  private checkWindowSize() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth < 751) {
      this.chatActive = false;
    }
    if (this.windowWidth > 750) {
      this.chatActive = true;
      this.channelActive = true;
    }
  }

  openChat(){
    if (this.windowWidth < 751) {
      this.chatActive = !this.chatActive;
      this.channelActive = !this.channelActive;
    }
  }
}
