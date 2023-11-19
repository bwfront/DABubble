import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private firestore: AngularFirestore) {}

  getChannels(): Observable<any[]> {
    return this.firestore.collection('channels').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { data };
      }))
    );
  }
}