export interface Bus {
  id: string;
  name: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  type: 'AC Sleeper' | 'Non-AC Sleeper' | 'AC Seater' | 'Volvo';
  rating: number;
  totalSeats: number;
  availableSeats: number;
  amenities: string[];
  operator: string;
}

export interface Seat {
  id: string;
  number: string;
  row: number;
  col: number;
  deck: 'lower' | 'upper';
  status: 'available' | 'booked' | 'selected' | 'ladies';
  price: number;
}

export interface Booking {
  id: string;
  bus: Bus;
  seats: string[];
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  totalAmount: number;
  bookingDate: Date;
  journeyDate: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  pnr: string;
}

export interface SearchQuery {
  from: string;
  to: string;
  date: string;
  passengers: number;
}
