import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

export type UserData = {
  realName: string;
  avatarURl: string;
  uid: string;
  email: string;
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _firestore = inject(Firestore);
  
  async getUserRef(docId: string): Promise<UserData | null> {
    try {
      const docRef = doc(this._firestore, 'users', docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserData;
        return {
          realName: data.realName,
          avatarURl: data.avatarURl,
          uid: data.uid,
          email: data.email
        };
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

}
