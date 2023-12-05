import { Component, EventEmitter, Output } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-link-user-pop-up',
  templateUrl: './link-user-pop-up.component.html',
  styleUrls: ['./link-user-pop-up.component.sass'],
})
export class LinkUserPopUpComponent {
  @Output() userClicked: EventEmitter<string> = new EventEmitter();
  users: any = [];

  constructor(private channelS: ChannelService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.channelS.fetchData('users').subscribe((users) => {
      this.users = users;
    });
  }
  linkUser(user: any): void {
    this.userClicked.emit(user);
  }
}
