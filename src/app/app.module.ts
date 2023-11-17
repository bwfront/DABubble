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
import { RegistercardComponent } from './registercard/registercard.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { NewpasswordComponent } from './newpassword/newpassword.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

const firebaseConfig = {
  projectId: 'dabubble-1a43e',
  appId: '1:913169184248:web:8beb137d5661d06397120d',
  storageBucket: 'dabubble-1a43e.appspot.com',
  apiKey: 'AIzaSyCemzBdnjhG6MBmsJGQVi4-i9RuWLyGGUs',
  authDomain: 'dabubble-1a43e.firebaseapp.com',
  messagingSenderId: '913169184248',
};

@NgModule({
  declarations: [
    AppComponent,
    LandingAnimationComponent,
    LoginpageComponent,
    LogincardComponent,
    RegistercardComponent,
    ImprintComponent,
    PrivacypolicyComponent,
    PasswordresetComponent,
    NewpasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    RouterLinkActive,
    CommonModule,
    RouterLink,
    FormsModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(firebaseConfig),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'dabubble-1a43e',
        appId: '1:913169184248:web:8beb137d5661d06397120d',
        storageBucket: 'dabubble-1a43e.appspot.com',
        apiKey: 'AIzaSyCemzBdnjhG6MBmsJGQVi4-i9RuWLyGGUs',
        authDomain: 'dabubble-1a43e.firebaseapp.com',
        messagingSenderId: '913169184248',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
