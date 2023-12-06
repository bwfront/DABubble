import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
interface ChatData {
  id: string;
  [key: string]: any;
  messages?: any[];
}
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private fire: Firestore) {}

  async fetchPrivateChat(uid: string) {
    const colRef = collection(this.fire, 'private_chats');
    const q = query(colRef, where('userIds', 'array-contains', uid));
    const querySnapshot = await getDocs(q);
    const chatsData: ChatData[] = [];
    for (const doc of querySnapshot.docs) {
      const chatData: ChatData = { id: doc.id, ...doc.data() };
      const messagesRef = collection(this.fire, `private_chats/${doc.id}/messages`);
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
  
}
