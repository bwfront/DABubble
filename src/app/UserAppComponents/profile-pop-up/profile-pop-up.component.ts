import { Component } from '@angular/core';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';
import { PopUpMenuComponent } from '../pop-up-menu/pop-up-menu.component';
@Component({
  selector: 'app-profile-pop-up',
  templateUrl: './profile-pop-up.component.html',
  styleUrls: ['./profile-pop-up.component.sass']
})
export class ProfilePopUpComponent {

  constructor(private popupmenu: PopUpMenuComponent){}

  closeProfile(){
    this.popupmenu.profilePopUpOpen = false;
  }

}
