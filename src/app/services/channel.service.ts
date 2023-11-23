import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { elementAt, map, take } from 'rxjs/operators';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
} from '@angular/fire/firestore';

interface Channel {
  participants: string[];
}
interface User {
  uid: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  constructor(private firestore: AngularFirestore) {}
  fire: Firestore = inject(Firestore);

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

  async createChannel(channel: any, users: string): Promise<void> {
    try {
      let participants$: any;
      if (users === 'all') {
        participants$ = this.firestore
          .collection('users')
          .valueChanges()
          .pipe(
            map((usersData) => usersData as User[]),
            map((usersData) => usersData.map((user) => user.uid))
          );
        const participants = await participants$.pipe(take(1)).toPromise();
        channel.participants = participants;
      }
      await this.firestore.collection('group_chats').doc().set({
        created_at: new Date(),
        group_name: channel.name,
        description: channel.description,
        participants: channel.participants,
        createdby: channel.createdby,
      });
    } catch (error) {
      console.error('Error writing document: ', error);
    }
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

  updateChannelParticipants(
    channelId: string,
    updatedParticipants: string[]
  ): Promise<void> {
    return this.firestore
      .collection('group_chats')
      .doc(channelId)
      .update({ participants: updatedParticipants })
      .catch((error) => {
        console.error('Error updating document: ', error);
      });
  }

  editParticipant(
    channelId: string,
    participant: string,
    add: boolean
  ): Promise<void> {
    return this.firestore
      .collection('group_chats')
      .doc(channelId)
      .get()
      .toPromise()
      .then((docSnapshot) => {
        if (!docSnapshot || !docSnapshot.exists) {
          throw new Error('Channel not found');
        }
        const channelData = docSnapshot.data() as Channel;
        let participants = channelData.participants;
        if (add) {
          if (!participants.includes(participant)) {
            participants.push(participant);
          }
        } else {
          participants = participants.filter((p) => p !== participant);
        }
        return this.updateChannelParticipants(channelId, participants);
      })
      .catch((error) => {
        console.error('Error updating participants: ', error);
      });
  }

  async privateChat(uid: string, secuid: string) {
    let private_chats = await this.fetchPrivateChat();
    let chatExists = false;
    let chatelement;
    private_chats.forEach((chat: any) => {
      if (chat.userIds.includes(uid) && chat.userIds.includes(secuid)) {
        chatExists = true;
        chatelement = chat;
      }
    });
    if (!chatExists) {
      return this.createPrivateChat(uid, secuid);
    }
    return chatelement;
  }

  async fetchPrivateChat() {
    const colRef = collection(this.fire, 'private_chats');
    const docs = await getDocs(colRef);
    const collectionData: any = [];
    docs.forEach((doc) => {
      collectionData.push({ id: doc.id, ...doc.data() });
    });
    return collectionData;
  }

  async createPrivateChat(uid: string, secuid: string) {
    const colRef = collection(this.fire, 'private_chats');
    let privatechat = {
      userIds: [uid, secuid],
      created_at: new Date(),
    };
    await addDoc(colRef, privatechat)
      .then(() => {
        return colRef.id;
      })
      .catch(() => {
        console.log('konnte nicht erstellet werden');
      });
  }
}
