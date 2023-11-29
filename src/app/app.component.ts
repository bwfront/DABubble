import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'DABubble';

  constructor(private router: Router) {}
  
  ngOnInit() {
    window.onbeforeunload = function() {window.scrollTo(0,0);}
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateBodyOverflow();
      }
    });
    this.updateBodyOverflow();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateBodyOverflow();
  }

  private updateBodyOverflow() {
    if (this.router.url === '/dabubble') {
      document.body.style.overflow = 'hidden';
    } else {
      if (window.innerWidth <= 650 || window.innerHeight <= 955) {
        document.body.style.overflow = 'hidden';
        setTimeout(()=>{
          document.body.style.overflowY = 'scroll';
          document.body.style.overflowX = 'hidden';
        }, 3300)
      }
    }
  }
}
