import {
  Component,
  EventEmitter,
  Output,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-link-user-pop-up',
  templateUrl: './link-user-pop-up.component.html',
  styleUrls: ['./link-user-pop-up.component.sass'],
})
export class LinkUserPopUpComponent {
  @Output() userClicked: EventEmitter<string> = new EventEmitter();
  @Output() closePopupEvent = new EventEmitter<void>();
  @ViewChild('popup') popup: ElementRef | undefined;
  users: any = [];
  justOpened = false;
  constructor(private channelS: ChannelService) {}
  ngOnInit() {
    this.loadUsers();
    this.openPopup();
  }

  loadUsers() {
    this.channelS.fetchData('users').subscribe((users) => {
      this.users = users;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.justOpened) {
      this.justOpened = false;
      return;
    }
    if (this.popup && !this.popup.nativeElement.contains(event.target)) {
      this.closePopup();
    }
  }

  openPopup(): void {
    this.justOpened = true;
    setTimeout(() => (this.justOpened = false), 100);
  }

  closePopup(): void {
    this.closePopupEvent.emit();
  }

  linkUser(user: any): void {
    this.userClicked.emit(user);
  }
}
