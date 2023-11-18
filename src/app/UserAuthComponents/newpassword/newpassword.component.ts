import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.sass'],
})
export class NewpasswordComponent {
  oobCode: string = '';
  newPassword: string = '';
  confirmPassword: any = '';

  backToLogin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authservice: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.oobCode = params['oobCode'];
    });
  }

  setNewPassword() {
    this.authservice.setNewPassword(this.oobCode, this.newPassword).then(() => {
      this.router.navigate(['/']);
    });
  }
}
