import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingAnimationComponent } from './UserAuthComponents/landing-animation/landing-animation.component';
import { LoginpageComponent } from './UserAuthComponents/loginpage/loginpage.component';
import { LogincardComponent } from './UserAuthComponents/logincard/logincard.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { RegistercardComponent } from './UserAuthComponents/registercard/registercard.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { ImprintComponent } from './UserAuthComponents/imprint/imprint.component';
import { PrivacypolicyComponent } from './UserAuthComponents/privacypolicy/privacypolicy.component';
import { PasswordresetComponent } from './UserAuthComponents/passwordreset/passwordreset.component';
import { NewpasswordComponent } from './UserAuthComponents/newpassword/newpassword.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from './UserAppComponents/searchbar/searchbar.component';
import { ProfileComponent } from './UserAppComponents/profile/profile.component';
import { DabubbleappComponent } from './UserAppComponents/dabubbleapp/dabubbleapp.component';
import { ProfilePopUpComponent } from './UserAppComponents/profile-pop-up/profile-pop-up.component';
import { PopUpMenuComponent } from './UserAppComponents/pop-up-menu/pop-up-menu.component';
import { ChanelMenuComponent } from './UserAppComponents/chanel-menu/chanel-menu.component';
import { CreateChannelPopUpComponent } from './UserAppComponents/create-channel-pop-up/create-channel-pop-up.component';
import { ChatComponent } from './UserAppComponents/chat/chat.component';
import { SecondaryChatComponent } from './UserAppComponents/secondary-chat/secondary-chat.component';
import { EditChannelComponent } from './UserAppComponents/edit-channel/edit-channel.component';
import { PrivatechatComponent } from './UserAppComponents/privatechat/privatechat.component';
import { UsersProfilePopUpComponent } from './UserAppComponents/users-profile-pop-up/users-profile-pop-up.component';

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
    SearchbarComponent,
    ProfileComponent,
    DabubbleappComponent,
    ProfilePopUpComponent,
    PopUpMenuComponent,
    ChanelMenuComponent,
    CreateChannelPopUpComponent,
    ChatComponent,
    SecondaryChatComponent,
    EditChannelComponent,
    PrivatechatComponent,
    UsersProfilePopUpComponent,
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
