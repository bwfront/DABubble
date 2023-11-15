import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingAnimationComponent } from './landing-animation/landing-animation.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LogincardComponent } from './logincard/logincard.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingAnimationComponent,
    LoginpageComponent,
    LogincardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
