import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Get item from local storage
  public get(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  // Set item in local storage
  public set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Remove item from local storage
  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all local storage
  public clear(): void {
    localStorage.clear();
  }
}
