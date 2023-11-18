import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { DabubbleappComponent } from '../dabubbleapp/dabubbleapp.component';

@Component({
  selector: 'app-pop-up-menu',
  templateUrl: './pop-up-menu.component.html',
  styleUrls: ['./pop-up-menu.component.sass']
})
export class PopUpMenuComponent {
  menuOpen: boolean = true;
  profilePopUpOpen: boolean = false;

  constructor(private local: LocalStorageService, private authservice: AuthService, private router: Router, private dabubble : DabubbleappComponent){}
  
  closePopUp(){
    this.dabubble.profilePopUpOpen = false
  }
  
  userLogout(){
    this.local.remove('currentUser')
    this.authservice.logOut();
    this.router.navigate(['/']); 
  }
}
