import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewpasswordComponent } from './UserAuthComponents/newpassword/newpassword.component';
import { LoginpageComponent } from './UserAuthComponents/loginpage/loginpage.component';
import { DabubbleappComponent } from './UserAppComponents/dabubbleapp/dabubbleapp.component';

const routes: Routes = [
  
  { path: '', component: LoginpageComponent },
  { path: 'newpassword/:action', component: NewpasswordComponent },
  { path: 'dabubble', component: DabubbleappComponent },

];

@NgModule({
  
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
