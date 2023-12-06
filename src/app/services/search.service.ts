import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, forkJoin, map, switchMap, switchMapTo } from 'rxjs';
interface ChatData {
  id: string;
  [key: string]: any;
  messages?: any[];
}
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private fire: Firestore, private firestore: AngularFirestore) {}

  async fetchPrivateChat(uid: string) {
    const colRef = collection(this.fire, 'private_chats');
    const q = query(colRef, where('userIds', 'array-contains', uid));
    const querySnapshot = await getDocs(q);
    const chatsData: ChatData[] = [];
    for (const doc of querySnapshot.docs) {
      const chatData: ChatData = { id: doc.id, ...doc.data() };
      const messagesRef = collection(
        this.fire,
        `private_chats/${doc.id}/messages`
      );
      const messagesSnapshot = await getDocs(messagesRef);
      const messages: any[] = [];
      for (const messageDoc of messagesSnapshot.docs) {
        messages.push({ id: messageDoc.id, ...messageDoc.data() });
      }
      chatData.messages = messages;
      chatsData.push(chatData);
    }
    return chatsData;
  }
  

  fetchChannels(userId: string): Observable<any[]> {
    return this.firestore.collection('group_chats').get().pipe(
      switchMap((querySnapshot) => {
        const channels = querySnapshot.docs
          .map((doc) => ({ data: doc.data(), id: doc.id }))
          .filter((element: any) =>
            element.data.participants.includes(userId) || element.data.participants.includes('all')
          );
        return forkJoin(
          channels.map((channel) =>
            this.firestore.collection(`group_chats/${channel.id}/messages`).get().pipe(
              map((messagesSnapshot) => {
                const messages = messagesSnapshot.docs.map((msgDoc) => msgDoc.data());
                return { ...channel, messages };
              })
            )
          )
        );
      })
    );
  }
}