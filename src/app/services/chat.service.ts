import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
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

  sendMessage(
    chatId: string,
    senderId: string,
    messageText: string,
    collection: string
  ) {
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

  editMessage(
    collection: string,
    chatId: string,
    messageId: string,
    newMessage: string
  ) {
    const messageDoc = this.firestore
      .collection(collection)
      .doc(chatId)
      .collection('messages')
      .doc(messageId);
    return messageDoc.update({ text: newMessage, edit: true });
  }

  private async getMessageDoc(transaction: firebase.firestore.Transaction, messageDocRef: firebase.firestore.DocumentReference) {
    const messageDoc = await transaction.get(messageDocRef);
    const messageData = messageDoc.data();
    if (!messageData) {
      throw new Error("Message not found");
    }
    return messageData;
  }

  private processReactions(existingReactions: any[], reaction: any, from: string) {
    const existingReactionIndex = existingReactions.findIndex(r => r.from === from);
    if (existingReactionIndex !== -1) {
      if (existingReactions[existingReactionIndex].react === reaction) {
        return existingReactions.filter((_, index) => index !== existingReactionIndex);
      } else {
        existingReactions[existingReactionIndex].react = reaction;
      }
    } else {
      existingReactions.push({ from, react: reaction });
    }
    return existingReactions;
  }

  reactToMessage(
    collection: string,
    chatId: string,
    messageId: string,
    reaction: any,
    from: string
  ) {
    const messageDocRef = this.firestore
      .collection(collection)
      .doc(chatId)
      .collection('messages')
      .doc(messageId).ref;

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const messageData = await this.getMessageDoc(transaction, messageDocRef);
      const updatedReactions = this.processReactions(messageData['reactions'] || [], reaction, from);
      transaction.update(messageDocRef, { reactions: updatedReactions });
    });
  }

  
}
