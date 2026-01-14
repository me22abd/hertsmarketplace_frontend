# HertsMarketplace Frontend

Modern, mobile-first React + TypeScript frontend for the HertsMarketplace student marketplace platform.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Features

- 🎨 Modern, app-like UI design
- 📱 Mobile-first responsive design
- 🔐 JWT authentication
- 🔍 Real-time search and filtering
- 💬 Buyer-seller messaging
- ❤️ Save/favourite listings
- 📦 Listing management
- 🚀 Fast and optimized

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── BottomNav.tsx
│   ├── ListingCard.tsx
│   ├── Loading.tsx
│   └── ProtectedRoute.tsx
├── pages/            # Page components
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Home.tsx
│   ├── Search.tsx
│   ├── ListingDetail.tsx
│   ├── CreateListing.tsx
│   ├── Messages.tsx
│   ├── SavedListings.tsx
│   ├── Profile.tsx
│   └── MyListings.tsx
├── services/         # API integration
│   └── api.ts
├── store/            # State management
│   └── authStore.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Helper functions
│   └── helpers.ts
├── App.tsx           # Main app component with routing
├── main.tsx          # App entry point
└── index.css         # Global styles
```

## Key Features

### Authentication
- Student-only registration with @herts.ac.uk email
- JWT token-based authentication
- Automatic token refresh
- Protected routes

### Listings
- Create, view, edit, delete listings
- Image upload with validation
- Category and condition filters
- Real-time search
- Price range filtering
- Sort options
- Save/favourite listings

### Messaging
- Direct buyer-seller messaging
- Conversation management
- Real-time message updates
- Message read status

### User Profile
- Profile management
- View own listings
- View saved items
- Logout

## Design System

### Colors
- Primary: `#9A46CF` (Amethyst)
- Text Primary: `#0F172A`
- Text Secondary: `#64748B`
- Background: `#F1F5F9`
- Status Available: `#10B981`
- Status Reserved: `#F59E0B`
- Status Sold: `#EF4444`

### Typography
- Font: Inter
- Mobile-first approach
- Responsive text sizes

### Components
- Rounded corners (12-16px)
- Soft shadows
- Touch-friendly (min 44px touch targets)
- Smooth transitions

## API Integration

The frontend communicates with the Django REST API backend:

- Base URL: `/api` (proxied to `http://localhost:8000`)
- Authentication: JWT tokens in Authorization header
- Automatic token refresh on 401 errors

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive Web App ready

## Development

### Code Quality
```bash
# Run linter
npm run lint
```

### VS Code Extensions (Recommended)
- ESLint
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

## License

This project is part of HertsMarketplace v1.0
