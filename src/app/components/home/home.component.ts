import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-page">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="hero-content">
          <div class="hero-badge">✦ India's #1 Bus Booking Platform</div>
          <h1 class="hero-title">Your journey<br><span class="gradient-text">starts here</span></h1>
          <p class="hero-sub">Book bus tickets instantly across 5000+ routes in India</p>
        </div>
      </section>

      <!-- Search Card -->
      <section class="search-section">
        <div class="search-card">
          <h2 class="search-title">Search Buses</h2>
          <div class="search-grid">
            <div class="form-group">
              <label>From</label>
              <select [(ngModel)]="from" class="form-control">
                <option value="">Select city</option>
                <option *ngFor="let city of cities" [value]="city">{{ city }}</option>
              </select>
            </div>

            <button class="swap-btn" (click)="swapCities()" title="Swap cities">⇄</button>

            <div class="form-group">
              <label>To</label>
              <select [(ngModel)]="to" class="form-control">
                <option value="">Select city</option>
                <option *ngFor="let city of cities" [value]="city">{{ city }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Journey Date</label>
              <input type="date" [(ngModel)]="date" [min]="today" class="form-control" />
            </div>

            <div class="form-group">
              <label>Passengers</label>
              <select [(ngModel)]="passengers" class="form-control">
                <option *ngFor="let n of [1,2,3,4,5,6]" [value]="n">{{ n }} Passenger{{ n > 1 ? 's' : '' }}</option>
              </select>
            </div>
          </div>

          <div *ngIf="error" class="error-msg">{{ error }}</div>

          <button class="search-btn" (click)="search()">
            🔍 Search Buses
          </button>
        </div>
      </section>

      <!-- Features -->
      <section class="features-section">
        <div class="features-grid">
          <div class="feature-card" *ngFor="let f of features">
            <div class="feature-icon">{{ f.icon }}</div>
            <div class="feature-title">{{ f.title }}</div>
            <div class="feature-desc">{{ f.desc }}</div>
          </div>
        </div>
      </section>

      <!-- Popular Routes -->
      <section class="routes-section">
        <h2 class="section-title">Popular Routes</h2>
        <div class="routes-grid">
          <div class="route-card" *ngFor="let r of popularRoutes" (click)="quickSearch(r.from, r.to)">
            <div class="route-from">{{ r.from }}</div>
            <div class="route-arrow">→</div>
            <div class="route-to">{{ r.to }}</div>
            <div class="route-price">From ₹{{ r.price }}</div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent {
  from = '';
  to = '';
  date = '';
  passengers = 1;
  error = '';
  today = new Date().toISOString().split('T')[0];

  cities: string[];

  features = [
    { icon: '⚡', title: 'Instant Booking', desc: 'Confirm your seat in under 60 seconds' },
    { icon: '🔒', title: 'Secure Payments', desc: '100% safe & encrypted transactions' },
    { icon: '🎫', title: 'E-Tickets', desc: 'Get instant e-tickets on your phone' },
    { icon: '🔄', title: 'Easy Cancellation', desc: 'Hassle-free cancellation & refunds' }
  ];

  popularRoutes = [
    { from: 'Chennai', to: 'Bangalore', price: 449 },
    { from: 'Mumbai', to: 'Pune', price: 299 },
    { from: 'Delhi', to: 'Agra', price: 349 },
    { from: 'Hyderabad', to: 'Chennai', price: 699 },
    { from: 'Bangalore', to: 'Coimbatore', price: 599 },
    { from: 'Chennai', to: 'Madurai', price: 399 }
  ];

  constructor(private bookingService: BookingService, private router: Router) {
    this.cities = bookingService.cities;
  }

  swapCities() {
    [this.from, this.to] = [this.to, this.from];
  }

  search() {
    this.error = '';
    if (!this.from) { this.error = 'Please select departure city.'; return; }
    if (!this.to) { this.error = 'Please select destination city.'; return; }
    if (this.from === this.to) { this.error = 'From and To cities cannot be the same.'; return; }
    if (!this.date) { this.error = 'Please select a journey date.'; return; }
    this.bookingService.setSearchQuery({ from: this.from, to: this.to, date: this.date, passengers: this.passengers });
    this.router.navigate(['/buses']);
  }

  quickSearch(from: string, to: string) {
    this.from = from;
    this.to = to;
    this.date = this.today;
    this.bookingService.setSearchQuery({ from, to, date: this.today, passengers: 1 });
    this.router.navigate(['/buses']);
  }
}
