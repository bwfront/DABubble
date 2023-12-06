import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.sass']
})
export class SearchbarComponent {
  showSearchContent: boolean = false
  searchmodel: string = 'Hallo';
  uid: string = '';
  privateChat: any;
  searchedPrivateChat: string[] = [];
  constructor(private SearchS:  SearchService,private localS:  LocalStorageService){}
  ngOnInit(){
    this.getUid()
    this.fetchData()
  }

  async fetchData(){
    this.privateChat = await this.SearchS.fetchPrivateChat(this.uid);
    this.searchPrivateChat()
  }

  searchPrivateChat(){
    this.privateChat.forEach((pChat: any) => {
      pChat.messages.forEach((message: any) => {
        if(message.text.includes(this.searchmodel)){
          pChat.messages = message;
          this.searchedPrivateChat.push(pChat);
        }
      });
    });
  }

  getUid() {
    let data = this.localS.get('currentUser');
    this.uid = data.user.uid;
  }
}
