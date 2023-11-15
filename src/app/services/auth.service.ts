import { Injectable, inject } from '@angular/core';
import {
  Auth,
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  UserCredential,
  createUserWithEmailAndPassword
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  provider = new GoogleAuthProvider();
  private _auth = inject(Auth);
  constructor() {

  }

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this._auth, email, password);
  }

  byGoogle(): Promise<UserCredential> {
    return signInWithRedirect(this._auth, new GoogleAuthProvider());
  }

  signup(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this._auth,
      email.trim(),
      password.trim()
    );
  }
}