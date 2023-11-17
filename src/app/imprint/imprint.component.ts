import { Component } from '@angular/core';
import { LoginpageComponent } from '../loginpage/loginpage.component';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.sass']
})
export class ImprintComponent {
  constructor(private loginpage: LoginpageComponent){}
  
  closeImprint(){
    this.loginpage.imprintcard = false
  }
  
}
