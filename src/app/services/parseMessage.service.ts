import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root',
})
export class MessageParsingService {
  constructor(
    private channelS: ChannelService
  ) {this.loadUsers()}
  users: any;

  parseMessage(
    messageText: string
  ): Array<{ text: string; isUsername: boolean; id: string }> {
    const segments = [];
    let remainingText = messageText;
    while (remainingText.length > 0) {
      if (remainingText.startsWith('@')) {
        const usernameInfo = this.findUsername(remainingText);
        if (usernameInfo) {
          segments.push({
            text: usernameInfo.username,
            isUsername: true,
            id: usernameInfo.id,
          });
          remainingText = remainingText
            .substring(usernameInfo.username.length)
            .trimStart();
          continue;
        }
      }
      const nonUsernameText = this.processNonUsernameText(remainingText);
      segments.push({ text: nonUsernameText.text, isUsername: false, id: '' });
      remainingText = remainingText
        .substring(nonUsernameText.text.length)
        .trimStart();
    }
    return segments;
  }

  loadUsers() {
    this.channelS.fetchData('users').subscribe((users) => {
      this.users = users;
    });
  }

  private findUsername(text: string): { username: string; id: string } | null {
    for (let user of this.users) {
      let username = `@${user.data.realName}`;
      if (text.startsWith(username)) {
        return { username, id: user.id };
      }
    }
    return null;
  }

  private processNonUsernameText(text: string): { text: string } {
    let nextSpaceIndex = text.indexOf(' ');
    if (nextSpaceIndex === -1) nextSpaceIndex = text.length;
    return { text: text.substring(0, nextSpaceIndex) };
  }
}
