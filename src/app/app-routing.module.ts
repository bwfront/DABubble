import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewpasswordComponent } from './newpassword/newpassword.component';
import { LoginpageComponent } from './loginpage/loginpage.component';

const routes: Routes = [

  { path: '', component: LoginpageComponent },
  { path: 'newpassword/:action', component: NewpasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
