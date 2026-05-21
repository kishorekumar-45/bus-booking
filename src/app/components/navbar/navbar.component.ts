import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a class="nav-brand" routerLink="/">
          <span class="brand-icon">🚌</span>
          <span class="brand-text">BusGo</span>
        </a>
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
          <a routerLink="/my-bookings" routerLinkActive="active">My Bookings</a>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public router: Router) {}
}
