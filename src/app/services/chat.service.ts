import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, finalize, map } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Message } from '../models/message.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';

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

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {}

  uploadFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = `uploads/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(downloadURL => {
            resolve(downloadURL);
          }, error => reject(error));
        })
      ).subscribe();
    });
  }

  sendMessage(
    chatId: string,
    senderId: string,
    messageText: string,
    collection: string,
    fileUrl?: any,
    fileType?: any
  ) {
    const message = {
      sender_id: senderId,
      text: messageText,
      date: this.getDate(),
      time: this.getTime(),
      timestamp: new Date(),
      reactions: [],
      fileType: 'text',
      fileUrl: ''
    };
    if (fileUrl && fileType) {
      message.fileUrl = fileUrl;
      message.fileType = fileType;
    }
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

  private async getMessageDoc(
    transaction: firebase.firestore.Transaction,
    messageDocRef: firebase.firestore.DocumentReference
  ) {
    const messageDoc = await transaction.get(messageDocRef);
    const messageData = messageDoc.data();
    if (!messageData) {
      throw new Error('Message not found');
    }
    return messageData;
  }

  private processReactions(
    existingReactions: any[],
    reaction: any,
    from: string
  ) {
    let userHasReacted = false;
    let userReactionType = null;
    existingReactions.forEach((reactionObj) => {
      if (reactionObj.from.includes(from)) {
        userHasReacted = true;
        userReactionType = reactionObj.react;
      }
    });
    if (userHasReacted) {
      existingReactions = existingReactions
        .map((reactionObj) => {
          return {
            react: reactionObj.react,
            from: reactionObj.from.filter((f: any) => f !== from),
          };
        })
        .filter((reactionObj) => reactionObj.from.length > 0);
      if (userReactionType !== reaction) {
        this.addOrUpdateReaction(existingReactions, reaction, from);
      }
    } else {
      this.addOrUpdateReaction(existingReactions, reaction, from);
    }
    return existingReactions;
  }

  private addOrUpdateReaction(
    existingReactions: any[],
    reaction: any,
    from: string
  ) {
    const reactionIndex = existingReactions.findIndex(
      (r: any) => r.react === reaction
    );
    if (reactionIndex !== -1) {
      existingReactions[reactionIndex].from.push(from);
    } else {
      existingReactions.push({ react: reaction, from: [from] });
    }
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
      const updatedReactions = this.processReactions(
        messageData['reactions'] || [],
        reaction,
        from
      );
      transaction.update(messageDocRef, { reactions: updatedReactions });
    });
  }
}
