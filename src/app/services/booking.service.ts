import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Bus, Booking, Seat, SearchQuery } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {

  private searchQuery = new BehaviorSubject<SearchQuery | null>(null);
  searchQuery$ = this.searchQuery.asObservable();

  private selectedBus = new BehaviorSubject<Bus | null>(null);
  selectedBus$ = this.selectedBus.asObservable();

  private selectedSeats = new BehaviorSubject<string[]>([]);
  selectedSeats$ = this.selectedSeats.asObservable();

  private bookings = new BehaviorSubject<Booking[]>(this.loadBookings());
  bookings$ = this.bookings.asObservable();

  readonly cities = [
    'Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad',
    'Coimbatore', 'Madurai', 'Pune', 'Kolkata', 'Ahmedabad'
  ];

  readonly mockBuses: Bus[] = [
    {
      id: 'b1', name: 'VRL Travels', operator: 'VRL Logistics',
      from: 'Chennai', to: 'Bangalore',
      departure: '10:00 PM', arrival: '05:30 AM', duration: '7h 30m',
      price: 799, type: 'AC Sleeper', rating: 4.5,
      totalSeats: 40, availableSeats: 18,
      amenities: ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle']
    },
    {
      id: 'b2', name: 'SRS Travels', operator: 'SRS Pvt Ltd',
      from: 'Chennai', to: 'Bangalore',
      departure: '09:00 PM', arrival: '04:30 AM', duration: '7h 30m',
      price: 650, type: 'Non-AC Sleeper', rating: 4.1,
      totalSeats: 45, availableSeats: 30,
      amenities: ['Charging Point', 'Water Bottle']
    },
    {
      id: 'b3', name: 'Orange Tours', operator: 'Orange Travels',
      from: 'Chennai', to: 'Bangalore',
      departure: '11:30 PM', arrival: '06:00 AM', duration: '6h 30m',
      price: 1100, type: 'Volvo', rating: 4.8,
      totalSeats: 36, availableSeats: 8,
      amenities: ['WiFi', 'Charging Point', 'Blanket', 'Snacks', 'Entertainment']
    },
    {
      id: 'b4', name: 'KSRTC Express', operator: 'KSRTC',
      from: 'Chennai', to: 'Bangalore',
      departure: '07:00 AM', arrival: '01:30 PM', duration: '6h 30m',
      price: 450, type: 'AC Seater', rating: 3.9,
      totalSeats: 50, availableSeats: 35,
      amenities: ['Charging Point']
    },
    {
      id: 'b5', name: 'Parveen Travels', operator: 'Parveen Pvt Ltd',
      from: 'Chennai', to: 'Bangalore',
      departure: '08:30 PM', arrival: '04:00 AM', duration: '7h 30m',
      price: 850, type: 'AC Sleeper', rating: 4.3,
      totalSeats: 40, availableSeats: 22,
      amenities: ['WiFi', 'Charging Point', 'Blanket']
    }
  ];

  setSearchQuery(q: SearchQuery) { this.searchQuery.next(q); }
  getSearchQuery() { return this.searchQuery.getValue(); }

  setSelectedBus(bus: Bus) { this.selectedBus.next(bus); }
  getSelectedBus() { return this.selectedBus.getValue(); }

  setSelectedSeats(seats: string[]) { this.selectedSeats.next(seats); }
  getSelectedSeats() { return this.selectedSeats.getValue(); }

  getBuses(from: string, to: string): Bus[] {
    return this.mockBuses.filter(b =>
      b.from.toLowerCase() === from.toLowerCase() &&
      b.to.toLowerCase() === to.toLowerCase()
    );
  }

  generateSeats(busId: string): Seat[] {
    const seats: Seat[] = [];
    const bookedNos = ['2', '5', '8', '12', '15', '3', '19', '22'];
    const ladiesNos = ['1', '7'];
    let seatNum = 1;

    for (let deck of ['lower', 'upper'] as const) {
      for (let row = 1; row <= 9; row++) {
        for (let col of [1, 2]) {
          const num = String(seatNum++);
          seats.push({
            id: `${busId}-${deck}-${num}`,
            number: num,
            row, col, deck,
            status: ladiesNos.includes(num) ? 'ladies'
                  : bookedNos.includes(num) ? 'booked'
                  : 'available',
            price: deck === 'upper' ? 750 : 800
          });
        }
        if (row % 3 === 0) seatNum++; // aisle gap
      }
    }
    return seats;
  }

  addBooking(booking: Booking) {
    const current = this.bookings.getValue();
    const updated = [booking, ...current];
    this.bookings.next(updated);
    localStorage.setItem('bb_bookings', JSON.stringify(updated));
  }

  cancelBooking(id: string) {
    const updated = this.bookings.getValue().map(b =>
      b.id === id ? { ...b, status: 'cancelled' as const } : b
    );
    this.bookings.next(updated);
    localStorage.setItem('bb_bookings', JSON.stringify(updated));
  }

  generatePNR(): string {
    return 'BUS' + Math.random().toString(36).toUpperCase().slice(2, 8);
  }

  private loadBookings(): Booking[] {
    try {
      const raw = localStorage.getItem('bb_bookings');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }
}
