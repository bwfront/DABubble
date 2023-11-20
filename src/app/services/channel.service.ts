import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private firestore: AngularFirestore) {
    
  }

  fetchData(collection: string): Observable<any[]> {
    return this.firestore.collection(collection).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { data, id };
      }))
    );
  }

  createChannel(channel: any){
    return this.firestore.collection("group_chats").doc().set({
      created_at: new Date(),
      group_name: channel.name,
      description: channel.description,
      participants: channel.participants
    })
    .then(() => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}
}