import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.sass'],
})
export class NewpasswordComponent {
  oobCode: string = '';
  newPassword: string = '';
  confirmPassword: any = '';

  constructor(private route: ActivatedRoute, private authservice: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.oobCode = params['oobCode'];
    });
  }

  setNewPassword() {
    this.authservice.setNewPassword(this.oobCode, this.newPassword)
  }
}
