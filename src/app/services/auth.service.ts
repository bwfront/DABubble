import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updateEmail,
  signInWithPopup,
} from '@angular/fire/auth';
import { doc, setDoc, Firestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, catchError, last, switchMap, throwError } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  provider = new GoogleAuthProvider();
  private _auth = inject(Auth);
  private _firestore = inject(Firestore);
  private _firestorage = inject(AngularFireStorage);
  
  constructor(private firestore: AngularFirestore) {}

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this._auth, email, password);
  }

  byGoogle(): Promise<UserCredential> {
    return signInWithPopup(this._auth, new GoogleAuthProvider()).then(
      (userCredential) => {
        this.handleUserAuthentication(userCredential);
        return userCredential;
      }
    );
  }

  private handleUserAuthentication(userCredential: any) {
    if (userCredential._tokenResponse.isNewUser) {
      this.createUserCollection(userCredential.user);
    }
  }

  private createUserCollection(user: any) {
    const userRef = doc(this._firestore, 'users', user.uid);
    setDoc(userRef, {
      realName: user.displayName,
      avatarURl: user.photoURL,
      uid: user.uid,
      email: user.email,
    });
  }

  get auth() {
    return this._auth;
  }

  signUp(
    email: string,
    password: string,
    realName: string,
    avatarURl: string
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this._auth,
      email.trim(),
      password.trim()
    ).then((userCredential) => {
      this.addUserToChannel(userCredential.user.uid);
      return this.signUpName(userCredential, realName, avatarURl, email).then(
        () => userCredential
      );
    })
  }
  addUserToChannel(uid: string) {
    const channels = ['Bdlb3XLOXAa2rcgNeUKi', 'XDMpObBjKU9mwv2Rn9Tq', 'jXBsfTKaO5f3VB6XniaZ'];
    channels.forEach((channel) => {
      this.updateChannelParticipants(channel, uid);
    });
  }
  
  updateChannelParticipants(channelId: string, uid: string): Promise<void> {
    const channelRef = this.firestore.collection('group_chats').doc(channelId);
    return channelRef.update({
      participants: firebase.firestore.FieldValue.arrayUnion(uid)
    })
    .catch((error) => console.error("Error updating participants: ", error));
  }


  async signUpName(
    userCredential: any,
    realName: string,
    avatarURl: string,
    email: string
  ) {
    return updateProfile(userCredential.user, {
      displayName: realName,
    }).then(() => {
      const userRef = doc(this._firestore, 'users', userCredential.user.uid);
      return setDoc(userRef, {
        realName: realName,
        avatarURl: avatarURl,
        uid: userCredential.user.uid,
        email: email,
      });
    });
  }



  uploadFile(file: File): Observable<string> {
    const filePath = `userAvatars/${new Date().getTime()}_${file.name}`;
    const fileRef = this._firestorage.ref(filePath);
    const task = this._firestorage.upload(filePath, file);

    return task.snapshotChanges().pipe(
      last(),
      switchMap(() => fileRef.getDownloadURL()),
      catchError((error) => {
        console.error('Error uploading file:', error);
        return throwError(error);
      })
    );
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this._auth, email).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  setNewPassword(code: string, newPassword: string) {
    return confirmPasswordReset(this._auth, code, newPassword)
      .then(() => {
        return true;
      })
      .catch(() => {
        return null;
      });
  }

  logOut() {
    this._auth.signOut().catch((error) => {
      console.log('Sign Out Failed', error);
    });
  }

  changeEmail(newEmail: string) {
    let current = this._auth.currentUser;
    if (current) {
      return updateEmail(current, newEmail).catch((error) => {
        console.error(error);
      });
    } else {
      return Promise.reject('No current user');
    }
  }

  changeName(name: string) {
    let current = this._auth.currentUser;
    if (current) {
      return updateProfile(current, { displayName: name })
        .then(() => 'Profile updated successfully')
        .catch((error) => Promise.reject(error));
    } else {
      return Promise.reject('No current user');
    }
  }
}
