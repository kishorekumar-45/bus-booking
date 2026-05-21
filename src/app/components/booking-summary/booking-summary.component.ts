import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Bus, Booking } from '../../models/booking.model';

@Component({
  selector: 'app-booking-summary',
  template: `
    <div class="summary-page">
      <div class="summary-container">

        <div *ngIf="!confirmed">
          <h2 class="page-title">Complete Your Booking</h2>

          <div class="summary-layout">
            <!-- Passenger Form -->
            <div class="passenger-form">
              <h3 class="form-section-title">Passenger Details</h3>
              <form [formGroup]="form">
                <div class="form-group">
                  <label>Full Name *</label>
                  <input formControlName="name" class="form-control" placeholder="Enter your full name" />
                  <div class="field-error" *ngIf="form.get('name')?.touched && form.get('name')?.invalid">
                    Name is required
                  </div>
                </div>
                <div class="form-group">
                  <label>Email Address *</label>
                  <input formControlName="email" type="email" class="form-control" placeholder="your@email.com" />
                  <div class="field-error" *ngIf="form.get('email')?.touched && form.get('email')?.invalid">
                    Valid email is required
                  </div>
                </div>
                <div class="form-group">
                  <label>Phone Number *</label>
                  <input formControlName="phone" class="form-control" placeholder="10-digit mobile number" maxlength="10" />
                  <div class="field-error" *ngIf="form.get('phone')?.touched && form.get('phone')?.invalid">
                    Valid 10-digit phone is required
                  </div>
                </div>
                <div class="form-group">
                  <label>Journey Date *</label>
                  <input formControlName="journeyDate" type="date" class="form-control" [min]="today" />
                </div>
              </form>
            </div>

            <!-- Trip Summary -->
            <div class="trip-summary-card">
              <h3 class="form-section-title">Trip Summary</h3>
              <div class="trip-detail">
                <span class="td-label">Bus</span>
                <span class="td-val">{{ bus?.name }}</span>
              </div>
              <div class="trip-detail">
                <span class="td-label">Route</span>
                <span class="td-val">{{ bus?.from }} → {{ bus?.to }}</span>
              </div>
              <div class="trip-detail">
                <span class="td-label">Timing</span>
                <span class="td-val">{{ bus?.departure }} — {{ bus?.arrival }}</span>
              </div>
              <div class="trip-detail">
                <span class="td-label">Seats</span>
                <span class="td-val">{{ seats.join(', ') }}</span>
              </div>
              <div class="trip-detail">
                <span class="td-label">Type</span>
                <span class="td-val">{{ bus?.type }}</span>
              </div>

              <div class="price-breakdown">
                <div class="pb-row">
                  <span>{{ seats.length }} seat(s) × ₹{{ bus?.price }}</span>
                  <span>₹{{ subtotal }}</span>
                </div>
                <div class="pb-row">
                  <span>GST (5%)</span>
                  <span>₹{{ taxes }}</span>
                </div>
                <div class="pb-row total">
                  <span>Total Payable</span>
                  <span>₹{{ subtotal + taxes }}</span>
                </div>
              </div>

              <button class="confirm-btn" (click)="confirmBooking()" [disabled]="form.invalid">
                ✅ Confirm & Pay ₹{{ subtotal + taxes }}
              </button>
            </div>
          </div>
        </div>

        <!-- Success State -->
        <div *ngIf="confirmed" class="success-screen">
          <div class="success-icon">🎉</div>
          <h2 class="success-title">Booking Confirmed!</h2>
          <p class="success-sub">Your ticket has been booked successfully.</p>
          <div class="pnr-box">
            <div class="pnr-label">PNR Number</div>
            <div class="pnr-number">{{ pnr }}</div>
          </div>
          <div class="ticket-info">
            <div class="ti-row"><span>Passenger</span><strong>{{ form.value.name }}</strong></div>
            <div class="ti-row"><span>Route</span><strong>{{ bus?.from }} → {{ bus?.to }}</strong></div>
            <div class="ti-row"><span>Seats</span><strong>{{ seats.join(', ') }}</strong></div>
            <div class="ti-row"><span>Amount Paid</span><strong>₹{{ subtotal + taxes }}</strong></div>
          </div>
          <div class="success-actions">
            <button class="outline-btn" (click)="router.navigate(['/my-bookings'])">View My Bookings</button>
            <button class="solid-btn" (click)="router.navigate(['/'])">Book Another</button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class BookingSummaryComponent implements OnInit {
  bus: Bus | null = null;
  seats: string[] = [];
  form!: FormGroup;
  confirmed = false;
  pnr = '';
  today = new Date().toISOString().split('T')[0];

  constructor(
    private bookingService: BookingService,
    public router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.bus = this.bookingService.getSelectedBus();
    this.seats = this.bookingService.getSelectedSeats();
    if (!this.bus || !this.seats.length) { this.router.navigate(['/']); return; }

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      journeyDate: [this.today, Validators.required]
    });
  }

  get subtotal() { return this.seats.length * (this.bus?.price || 0); }
  get taxes() { return Math.round(this.subtotal * 0.05); }

  confirmBooking() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.pnr = this.bookingService.generatePNR();
    const booking: Booking = {
      id: Date.now().toString(),
      bus: this.bus!,
      seats: this.seats,
      passengerName: this.form.value.name,
      passengerEmail: this.form.value.email,
      passengerPhone: this.form.value.phone,
      totalAmount: this.subtotal + this.taxes,
      bookingDate: new Date(),
      journeyDate: this.form.value.journeyDate,
      status: 'confirmed',
      pnr: this.pnr
    };
    this.bookingService.addBooking(booking);
    this.confirmed = true;
  }
}
