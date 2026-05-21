import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Bus, Seat } from '../../models/booking.model';

@Component({
  selector: 'app-seat-selection',
  template: `
    <div class="seat-page">
      <div class="seat-header">
        <button class="back-btn" (click)="goBack()">← Back</button>
        <div class="bus-info">
          <span class="bus-nm">{{ bus?.name }}</span>
          <span class="bus-route-sm">{{ bus?.from }} → {{ bus?.to }}</span>
        </div>
      </div>

      <div class="seat-layout">
        <!-- Seat Map -->
        <div class="seat-map-panel">
          <div class="deck-tabs">
            <button [class.active]="activeDeck === 'lower'" (click)="activeDeck = 'lower'">Lower Deck</button>
            <button [class.active]="activeDeck === 'upper'" (click)="activeDeck = 'upper'">Upper Deck</button>
          </div>

          <div class="seat-legend">
            <span class="legend-item"><span class="dot available"></span> Available</span>
            <span class="legend-item"><span class="dot booked"></span> Booked</span>
            <span class="legend-item"><span class="dot selected"></span> Selected</span>
            <span class="legend-item"><span class="dot ladies"></span> Ladies</span>
          </div>

          <div class="bus-outline">
            <div class="driver-area">🚌 Driver</div>
            <div class="seats-grid">
              <div class="seat-row" *ngFor="let row of getRows()">
                <div class="seat-col left">
                  <div *ngFor="let seat of getSeatsAt(row, 1)"
                    class="seat" [class]="seat.status"
                    (click)="toggleSeat(seat)" [title]="'Seat ' + seat.number">
                    {{ seat.number }}
                  </div>
                </div>
                <div class="aisle"></div>
                <div class="seat-col right">
                  <div *ngFor="let seat of getSeatsAt(row, 2)"
                    class="seat" [class]="seat.status"
                    (click)="toggleSeat(seat)" [title]="'Seat ' + seat.number">
                    {{ seat.number }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Panel -->
        <div class="booking-panel">
          <h3 class="panel-title">Booking Summary</h3>

          <div class="summary-row">
            <span>{{ bus?.from }} → {{ bus?.to }}</span>
          </div>
          <div class="summary-row">
            <span>{{ bus?.departure }} — {{ bus?.arrival }}</span>
          </div>

          <div class="selected-seats" *ngIf="selectedSeatNos.length">
            <div class="sum-label">Selected Seats</div>
            <div class="seat-tags">
              <span class="seat-tag" *ngFor="let s of selectedSeatNos">{{ s }}</span>
            </div>
          </div>

          <div class="price-calc" *ngIf="selectedSeatNos.length">
            <div class="calc-row">
              <span>{{ selectedSeatNos.length }} seat(s) × ₹{{ bus?.price }}</span>
              <span>₹{{ totalPrice }}</span>
            </div>
            <div class="calc-row taxes">
              <span>Taxes & Fees</span>
              <span>₹{{ taxes }}</span>
            </div>
            <div class="calc-row total">
              <span>Total</span>
              <span>₹{{ totalPrice + taxes }}</span>
            </div>
          </div>

          <div *ngIf="!selectedSeatNos.length" class="no-seat-msg">
            👆 Click on a seat to select
          </div>

          <button class="proceed-btn" [disabled]="!selectedSeatNos.length" (click)="proceed()">
            Proceed to Book →
          </button>
        </div>
      </div>
    </div>
  `
})
export class SeatSelectionComponent implements OnInit {
  bus: Bus | null = null;
  seats: Seat[] = [];
  activeDeck: 'lower' | 'upper' = 'lower';
  selectedSeatNos: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.bus = this.bookingService.getSelectedBus();
    if (!this.bus) { this.router.navigate(['/']); return; }
    this.seats = this.bookingService.generateSeats(this.bus.id);
  }

  get deckSeats() {
    return this.seats.filter(s => s.deck === this.activeDeck);
  }

  getRows(): number[] {
    const rows = [...new Set(this.deckSeats.map(s => s.row))];
    return rows.sort((a, b) => a - b);
  }

  getSeatsAt(row: number, col: number): Seat[] {
    return this.deckSeats.filter(s => s.row === row && s.col === col);
  }

  toggleSeat(seat: Seat) {
    if (seat.status === 'booked' || seat.status === 'ladies') return;
    if (seat.status === 'selected') {
      seat.status = 'available';
      this.selectedSeatNos = this.selectedSeatNos.filter(n => n !== seat.number);
    } else {
      seat.status = 'selected';
      this.selectedSeatNos = [...this.selectedSeatNos, seat.number];
    }
  }

  get totalPrice() {
    return this.selectedSeatNos.length * (this.bus?.price || 0);
  }

  get taxes() {
    return Math.round(this.totalPrice * 0.05);
  }

  proceed() {
    this.bookingService.setSelectedSeats(this.selectedSeatNos);
    this.router.navigate(['/summary']);
  }

  goBack() { this.router.navigate(['/buses']); }
}
