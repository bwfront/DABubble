import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private userProfileData = new BehaviorSubject<any>(null);

  constructor(private dataService: DataService) {}

  getUserProfile(uid: string) {
    this.dataService.getUserRef(uid).then(user => {
      this.userProfileData.next(user);
    }).catch(error => {
      console.error('Error fetching user data:', error);
    });
  }

  getUserProfileObservable() {
    return this.userProfileData.asObservable();
  }
}