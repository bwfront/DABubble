import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Answer } from '../models/answer.model';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  private threadSource = new BehaviorSubject<{
    message: any;
    channel: any;
  } | null>(null);
  selectedMessage = this.threadSource.asObservable();

  constructor(private firestore: AngularFirestore) {}

  setSelectedMessage(message: any, channel: any) {
    this.threadSource.next({ message, channel });
  }

  sendMessage(chatId: string, messageId: string, answer: Answer) {
    const messageDocRef = this.firestore
      .collection('group_chats')
      .doc(chatId)
      .collection('messages')
      .doc(messageId);
    messageDocRef.collection('thread').add(answer);
  }

  fetchReplies(chatId: string, messageId: string): Observable<Answer[]> {
    return this.firestore
      .collection('group_chats')
      .doc(chatId)
      .collection('messages')
      .doc(messageId)
      .collection('thread')
      .snapshotChanges()
      .pipe(
        map(changes => 
          changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() as Answer }))
        )
      );
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

  reactToMessage(
    chatId: string,
    messageId: string,
    threadId: string,
    reaction: any,
    from: string
  ) {
    const messageDocRef = this.firestore
      .collection('group_chats')
      .doc(chatId)
      .collection('messages')
      .doc(messageId)
      .collection('thread')
      .doc(threadId).ref;

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
