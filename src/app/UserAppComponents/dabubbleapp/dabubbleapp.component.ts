import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-dabubbleapp',
  templateUrl: './dabubbleapp.component.html',
  styleUrls: ['./dabubbleapp.component.sass'],
})
export class DabubbleappComponent {
  profilePopUpOpen: boolean = false;
  createChannelOpen: boolean = false;
  usersProfilePopUpOpen: boolean = false;

  groupChat: boolean = true;
  chatActive: boolean = true;
  channelActive: boolean = true;
  windowWidth: number = 0;
  movedChannel: boolean = false;

  threadActive: boolean = false;

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
      this.channelActive = true;
      this.threadActive = false;
    }
    if (this.windowWidth > 750) {
      if (!this.threadActive) {
        this.chatActive = true;
        this.channelActive = true;
      }
    }
  }

  openChat() {
    if (this.windowWidth < 751) {
      this.chatActive = !this.chatActive;
      this.channelActive = !this.channelActive;
    }
  }

  openThread() {
    if (this.windowWidth < 1300) {
      this.chatActive = !this.chatActive;
    } 
      this.threadActive = true;
  }
  
  closeThread() {
    if (this.windowWidth < 1300) {
      this.chatActive = true;
    }
    this.threadActive = false;
  }
}
