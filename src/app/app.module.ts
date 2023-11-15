import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingAnimationComponent } from './landing-animation/landing-animation.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LogincardComponent } from './logincard/logincard.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    LandingAnimationComponent,
    LoginpageComponent,
    LogincardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp({"projectId":"dabubble-1a43e","appId":"1:913169184248:web:8beb137d5661d06397120d","storageBucket":"dabubble-1a43e.appspot.com","apiKey":"AIzaSyCemzBdnjhG6MBmsJGQVi4-i9RuWLyGGUs","authDomain":"dabubble-1a43e.firebaseapp.com","messagingSenderId":"913169184248"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
