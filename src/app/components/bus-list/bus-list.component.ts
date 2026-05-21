import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Bus, SearchQuery } from '../../models/booking.model';

@Component({
  selector: 'app-bus-list',
  template: `
    <div class="bus-list-page">
      <div class="page-header">
        <div class="route-info">
          <span class="city">{{ query?.from }}</span>
          <span class="arrow">→</span>
          <span class="city">{{ query?.to }}</span>
        </div>
        <div class="meta">{{ query?.date | date:'EEE, dd MMM' }} · {{ query?.passengers }} Passenger{{ (query?.passengers || 1) > 1 ? 's' : '' }} · <strong>{{ filtered.length }} buses</strong> found</div>
      </div>

      <div class="list-layout">
        <!-- Filters Sidebar -->
        <aside class="filters-panel">
          <h3 class="filters-title">Filters</h3>

          <div class="filter-group">
            <div class="filter-label">Bus Type</div>
            <label *ngFor="let type of busTypes" class="checkbox-label">
              <input type="checkbox" [checked]="selectedTypes.includes(type)"
                (change)="toggleType(type)" />
              {{ type }}
            </label>
          </div>

          <div class="filter-group">
            <div class="filter-label">Price Range</div>
            <div class="price-range">₹{{ minPrice }} — ₹{{ maxPrice }}</div>
            <input type="range" min="200" max="2000" step="50"
              [(ngModel)]="maxPrice" (input)="applyFilters()" class="range-input" />
          </div>

          <div class="filter-group">
            <div class="filter-label">Rating</div>
            <label *ngFor="let r of [4, 3, 2]" class="checkbox-label">
              <input type="checkbox" [checked]="minRating === r"
                (change)="minRating = minRating === r ? 0 : r; applyFilters()" />
              {{ r }}+ ★
            </label>
          </div>

          <button class="clear-btn" (click)="clearFilters()">Clear All</button>
        </aside>

        <!-- Bus Cards -->
        <div class="buses-container">
          <div class="sort-bar">
            <span class="sort-label">Sort by:</span>
            <button *ngFor="let s of sortOptions" class="sort-btn"
              [class.active]="sortBy === s.value" (click)="sortBy = s.value; applyFilters()">
              {{ s.label }}
            </button>
          </div>

          <div *ngIf="filtered.length === 0" class="empty-state">
            <div class="empty-icon">🚌</div>
            <div class="empty-title">No buses found</div>
            <div class="empty-sub">Try adjusting your filters or search for a different route</div>
            <button class="back-btn" (click)="goBack()">← Change Route</button>
          </div>

          <div class="bus-card" *ngFor="let bus of filtered">
            <div class="bus-header">
              <div>
                <div class="bus-name">{{ bus.name }}</div>
                <div class="bus-type-badge">{{ bus.type }}</div>
              </div>
              <div class="bus-rating">★ {{ bus.rating }}</div>
            </div>

            <div class="bus-route">
              <div class="time-block">
                <div class="time">{{ bus.departure }}</div>
                <div class="city-name">{{ bus.from }}</div>
              </div>
              <div class="duration-block">
                <div class="duration-line"></div>
                <div class="duration-text">{{ bus.duration }}</div>
              </div>
              <div class="time-block right">
                <div class="time">{{ bus.arrival }}</div>
                <div class="city-name">{{ bus.to }}</div>
              </div>
            </div>

            <div class="bus-amenities">
              <span class="amenity" *ngFor="let a of bus.amenities">{{ a }}</span>
            </div>

            <div class="bus-footer">
              <div class="seats-info">
                <span [class.low]="bus.availableSeats < 10">{{ bus.availableSeats }} seats left</span>
              </div>
              <div class="price-block">
                <div class="price">₹{{ bus.price }}</div>
                <div class="price-sub">per person</div>
              </div>
              <button class="select-btn" (click)="selectBus(bus)">Select Seats →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BusListComponent implements OnInit {
  query: SearchQuery | null = null;
  allBuses: Bus[] = [];
  filtered: Bus[] = [];

  busTypes = ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Volvo'];
  selectedTypes: string[] = [];
  minPrice = 200;
  maxPrice = 2000;
  minRating = 0;
  sortBy = 'price';

  sortOptions = [
    { label: 'Price', value: 'price' },
    { label: 'Rating', value: 'rating' },
    { label: 'Departure', value: 'departure' },
    { label: 'Seats', value: 'seats' }
  ];

  constructor(private bookingService: BookingService, private router: Router) {}

  ngOnInit() {
    this.query = this.bookingService.getSearchQuery();
    if (!this.query) { this.router.navigate(['/']); return; }
    this.allBuses = this.bookingService.getBuses(this.query.from, this.query.to);
    // Show all mock buses if no exact match (for demo purposes)
    if (!this.allBuses.length) this.allBuses = this.bookingService.mockBuses;
    this.applyFilters();
  }

  toggleType(type: string) {
    this.selectedTypes = this.selectedTypes.includes(type)
      ? this.selectedTypes.filter(t => t !== type)
      : [...this.selectedTypes, type];
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.allBuses];
    if (this.selectedTypes.length) result = result.filter(b => this.selectedTypes.includes(b.type));
    result = result.filter(b => b.price <= this.maxPrice && b.rating >= this.minRating);
    result.sort((a, b) => {
      if (this.sortBy === 'price') return a.price - b.price;
      if (this.sortBy === 'rating') return b.rating - a.rating;
      if (this.sortBy === 'seats') return b.availableSeats - a.availableSeats;
      return a.departure.localeCompare(b.departure);
    });
    this.filtered = result;
  }

  clearFilters() {
    this.selectedTypes = [];
    this.maxPrice = 2000;
    this.minRating = 0;
    this.applyFilters();
  }

  selectBus(bus: Bus) {
    this.bookingService.setSelectedBus(bus);
    this.router.navigate(['/seats', bus.id]);
  }

  goBack() { this.router.navigate(['/']); }
}
