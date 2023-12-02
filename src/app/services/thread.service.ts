import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Answer } from '../models/answer.model';

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
      .valueChanges() as Observable<Answer[]>;
  }
}
