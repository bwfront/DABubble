import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';

@Component({
  selector: 'app-chanel-menu',
  templateUrl: './chanel-menu.component.html',
  styleUrls: ['./chanel-menu.component.sass'],
})
export class ChanelMenuComponent {
  channelOpen: boolean = true;
  channels: any[] = [];
  private subscription: Subscription = new Subscription();
  constructor(private channelService: ChannelService, private dabubble: DabubbleappComponent) {}

  ngOnInit() {
    this.loadChannels();
  }

  loadChannels() {
    this.subscription.add(
      this.channelService.getChannels().subscribe((channels) => {
        this.channels = channels;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createChannelOpen(){
    this.dabubble.createChannelOpen = true;
  }
}
