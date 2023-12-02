import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class ThreadService{
    private threadSource = new BehaviorSubject<{ message: any, channel: any } | null>(null);
    selectedMessage = this.threadSource.asObservable();

    constructor(){
    
    }

    setSelectedMessage(message: any, channel: any){
        this.threadSource.next({message, channel});
    }

  }