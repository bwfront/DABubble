import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
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
    let private_chats = await this.fetchPrivateChat(uid);
    for (let chat of private_chats) {
      if (
        uid !== secuid &&
        chat.userIds.includes(uid) &&
        chat.userIds.includes(secuid)
      ) {
        return chat;
      }
    }
    return this.createPrivateChat(uid, secuid);
  }

  async fetchPrivateChat(uid: string) {
    const colRef = collection(this.fire, 'private_chats');
    const q = query(colRef, where('userIds', 'array-contains', uid));
    const querySnapshot = await getDocs(q);
    const collectionData: any = [];
    querySnapshot.forEach((doc) => {
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

  async openPrivateNotes(uid: string) {
    const notes = await this.fetchPrivateChat(uid);
    for (const note of notes) {
      if (note.user == uid) {
        return note;
      }
    }
    return this.createPrivateNotes(uid);
  }

  async createPrivateNotes(uid: string) {
    const colRef = collection(this.fire, 'private_chats');
    let privatechat = {
      user: uid,
      userIds: [uid],
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
