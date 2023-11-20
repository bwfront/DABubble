import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private _openChannel = new BehaviorSubject<any>(null);
  
  public readonly openChannel = this._openChannel.asObservable();

  public updateOpenChannel(channel: any) {
    this._openChannel.next(channel);
  }

  constructor(private firestore: AngularFirestore){}



  sendMessage(chatId: string, senderId: string, messageText: string) {
    const message = {
      sender_id: senderId,
      text: messageText,
      timestamp: new Date()
    };

    return this.firestore.collection('group_chats').doc(chatId)
             .collection('messages').add(message)
             .then(() => console.log('Message sent'))
             .catch((error) => console.error('Error sending message:', error));
  }
}

