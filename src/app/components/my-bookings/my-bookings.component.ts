import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-my-bookings',
  template: `
    <div class="my-bookings-page">
      <div class="page-header">
        <h2 class="page-title">My Bookings</h2>
        <button class="new-booking-btn" (click)="router.navigate(['/'])">+ New Booking</button>
      </div>

      <div *ngIf="!bookings.length" class="empty-bookings">
        <div class="empty-icon">🎫</div>
        <div class="empty-title">No bookings yet</div>
        <div class="empty-sub">Your booked tickets will appear here</div>
        <button class="solid-btn" (click)="router.navigate(['/'])">Book a Bus</button>
      </div>

      <div class="bookings-list" *ngIf="bookings.length">
        <div class="booking-card" *ngFor="let b of bookings" [class.cancelled]="b.status === 'cancelled'">
          <div class="booking-header">
            <div class="pnr-info">
              <span class="pnr-label">PNR</span>
              <span class="pnr-val">{{ b.pnr }}</span>
            </div>
            <span class="status-badge" [class]="b.status">{{ b.status | titlecase }}</span>
          </div>

          <div class="booking-route">
            <div class="route-city">
              <div class="rc-time">{{ b.bus.departure }}</div>
              <div class="rc-name">{{ b.bus.from }}</div>
            </div>
            <div class="route-mid">
              <div class="route-line"></div>
              <div class="route-dur">{{ b.bus.duration }}</div>
              <div class="bus-type-sm">{{ b.bus.type }}</div>
            </div>
            <div class="route-city right">
              <div class="rc-time">{{ b.bus.arrival }}</div>
              <div class="rc-name">{{ b.bus.to }}</div>
            </div>
          </div>

          <div class="booking-meta">
            <div class="meta-item">
              <span class="mi-label">Passenger</span>
              <span class="mi-val">{{ b.passengerName }}</span>
            </div>
            <div class="meta-item">
              <span class="mi-label">Journey Date</span>
              <span class="mi-val">{{ b.journeyDate | date:'dd MMM yyyy' }}</span>
            </div>
            <div class="meta-item">
              <span class="mi-label">Seats</span>
              <span class="mi-val">{{ b.seats.join(', ') }}</span>
            </div>
            <div class="meta-item">
              <span class="mi-label">Amount</span>
              <span class="mi-val amount">₹{{ b.totalAmount }}</span>
            </div>
          </div>

          <div class="booking-footer" *ngIf="b.status === 'confirmed'">
            <button class="cancel-btn" (click)="cancel(b.id)">Cancel Booking</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];

  constructor(private bookingService: BookingService, public router: Router) {}

  ngOnInit() {
    this.bookingService.bookings$.subscribe(b => this.bookings = b);
  }

  cancel(id: string) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(id);
    }
  }
}
