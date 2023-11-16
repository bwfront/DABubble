import { Injectable, inject } from '@angular/core';
import {
  Auth,
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  UserCredential,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { doc, setDoc, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  provider = new GoogleAuthProvider();
  private _auth = inject(Auth);
  private _firestore = inject(Firestore);
  constructor() {}

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this._auth, email, password);
  }

  byGoogle(): Promise<UserCredential> {
    return signInWithRedirect(this._auth, new GoogleAuthProvider());
  }

  signUp(
    email: string,
    password: string,
    realName: string,
    avatar: string,
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this._auth,
      email.trim(),
      password.trim()
    ).then((userCredential) => {
      return this.signUpName(userCredential, realName).then(
        () => userCredential
      );
    });
  }

  signUpName(userCredential: any, realName: string) {
    return updateProfile(userCredential.user, {
      displayName: realName,
    }).then(() => {
      const userRef = doc(this._firestore, 'users', userCredential.user.uid);
      return setDoc(userRef, {
        realName: realName,
      });
    });
  }
}
