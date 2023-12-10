import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NewMessageService {
  private storedValue: any;
  newMessage: boolean = false;

  constructor() {}

  setValue(value: string): void {
    this.storedValue = value;
  }

  getValue(): any {
    if (this.newMessage) {
      return this.storedValue;
    } else {
      return '';
    }
  }
}
