import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  constructor(private firestore: AngularFirestore) {}

  fetchData(collection: string): Observable<any[]> {
    return this.firestore
      .collection(collection)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { data, id };
          })
        )
      );
  }

  createChannel(channel: any) {
    return this.firestore
      .collection('group_chats')
      .doc()
      .set({
        created_at: new Date(),
        group_name: channel.name,
        description: channel.description,
        participants: channel.participants,
        createdby: channel.createdby,
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  }
  updateChannelName(channelId: string, newName: string): Promise<void> {
    return this.firestore
      .collection('group_chats')
      .doc(channelId)
      .update({ group_name: newName })
      .catch((error) => {
        console.error('Error updating document: ', error);
      });
  }

  updateChannelDescription(channelId: string, newDesc: string): Promise<void> {
    return this.firestore
      .collection('group_chats')
      .doc(channelId)
      .update({ description: newDesc })
      .catch((error) => {
        console.error('Error updating document: ', error);
      });
  }
}
