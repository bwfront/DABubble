import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';

import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private _openChannel = new BehaviorSubject<any>(null);
  currentChannel: any[] = [];

  public readonly openChannel = this._openChannel.asObservable();

  public updateOpenChannel(channel: any) {
    this._openChannel.next(channel);
    this.currentChannel = channel;
  }

  constructor(private firestore: AngularFirestore) {}

  sendMessage(chatId: string, senderId: string, messageText: string, collection: string) {
    const message = {
      sender_id: senderId,
      text: messageText,
      date: this.getDate(),
      time: this.getTime(),
      timestamp: new Date(),
    };
    return this.firestore
      .collection(collection)
      .doc(chatId)
      .collection('messages')
      .add(message)
      .then(() => console.log('Message sent'))
      .catch((error) => console.error('Error sending message:', error));
  }

  getDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  getTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
  }

  getMessages(chatId: string, collection: string): Observable<Message[]> {
    return this.firestore
      .collection(collection)
      .doc(chatId)
      .collection<Message>('messages', (ref) => ref.orderBy('timestamp', 'asc'))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Message;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
}
