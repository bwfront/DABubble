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
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, catchError, finalize, last, switchMap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  provider = new GoogleAuthProvider();
  private _auth = inject(Auth);
  private _firestore = inject(Firestore);
  private _firestorage = inject(AngularFireStorage)
  constructor(private storage: AngularFireStorage) {}

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
    avatarURl: string,
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this._auth,
      email.trim(),
      password.trim()
    ).then((userCredential) => {
      return this.signUpName(userCredential, realName, avatarURl).then(
        () => userCredential
      );
    });
  }

  signUpName(userCredential: any, realName: string, avatarURl: string) {
    return updateProfile(userCredential.user, {
      displayName: realName,
    }).then(() => {
      const userRef = doc(this._firestore, 'users', userCredential.user.uid);
      return setDoc(userRef, {
        realName: realName,
        avatarURl: avatarURl,
      });
    });
  }

  uploadFile(file: File): Observable<string> {
    const filePath = `userAvatars/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
  
    return task.snapshotChanges().pipe(
      last(),
      switchMap(() => fileRef.getDownloadURL()),
      catchError(error => {
        console.error("Error uploading file:", error);
        return throwError(error);
      })
    );
  }
  
  
  
  

}
