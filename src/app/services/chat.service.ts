import { Injectable } from "@angular/core";
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
}
