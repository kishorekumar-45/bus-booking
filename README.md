# 🚌 BusGo — Bus Ticket Booking App

A full-featured bus ticket booking web application built with **Angular 17**, featuring a dark & sleek UI design.

## 🌟 Features

- **Home / Search** — Search buses by city, date & passengers with swap city support
- **Bus Listing** — Browse available buses with filters (type, price, rating) and sorting
- **Seat Selection** — Interactive dual-deck seat map (Lower & Upper) with real-time selection
- **Booking Summary** — Passenger details form with validation + price breakdown
- **My Bookings** — View all bookings with PNR, status and cancellation support
- **Local Storage** — Bookings persist across browser sessions

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 17 |
| Language | TypeScript |
| Styling | CSS3 (Custom Dark Theme) |
| State | RxJS BehaviorSubject |
| Routing | Angular Router |
| Forms | Reactive Forms + Template Forms |
| Storage | LocalStorage |

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/            # Sticky navigation bar
│   │   ├── home/              # Hero + search + popular routes
│   │   ├── bus-list/          # Bus listing with filters & sort
│   │   ├── seat-selection/    # Interactive seat map
│   │   ├── booking-summary/   # Passenger form + confirmation
│   │   └── my-bookings/       # Booking history
│   ├── models/
│   │   └── booking.model.ts   # TypeScript interfaces
│   ├── services/
│   │   └── booking.service.ts # Shared state & mock data
│   ├── app.module.ts
│   └── app.component.ts
├── styles.css                 # Global dark theme styles
├── index.html
└── main.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Angular CLI

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/bus-booking.git
cd bus-booking

# Install Angular CLI globally (if not installed)
npm install -g @angular/cli

# Install dependencies
npm install

# Run development server
ng serve
```

Open `http://localhost:4200` in your browser.

### Build for Production

```bash
ng build
```

Output will be in `dist/bus-booking/`.

## 📸 Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Search form + popular routes |
| Bus List | `/buses` | Filtered & sorted bus results |
| Seat Selection | `/seats/:busId` | Interactive seat map |
| Booking Summary | `/summary` | Passenger form + payment |
| My Bookings | `/my-bookings` | Booking history |

## 👨‍💻 Author

**Kishorekumar** — Full Stack Developer Intern  
[GitHub](https://github.com/YOUR_USERNAME) · [LinkedIn](https://linkedin.com/in/YOUR_PROFILE)
