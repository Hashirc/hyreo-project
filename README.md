# HYREO E-Commerce Application

## Project Overview

HYREO is a modern, full-stack e-commerce application built with Angular 20 (Standalone Components), Node.js/Express, and Firebase. The application features a clean, professional interface with an olive green and white theme.

## Tech Stack

### Frontend
- **Angular 20** with Standalone Components, Signals, @if, @for
- **Angular Material** for UI components
- **Firebase Authentication** for user management
- **Cloud Firestore** for database
- **Firebase Storage** for file uploads
- **TypeScript** for type-safe development
- **SCSS** for styling

### Backend
- **Node.js** with Express.js framework
- **Firebase Admin SDK** for server-side operations
- **TypeScript** for server-side code
- **Cloud Firestore** as primary database

### Deployment & Infrastructure
- Firebase Hosting (Frontend)
- Firebase Cloud Functions (Backend)
- Firebase Firestore Database
- Firebase Storage

## Project Structure

```
hyreo-project/
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── models/
│   │   │   │   ├── services/
│   │   │   │   ├── guards/
│   │   │   │   └── interceptors/
│   │   │   ├── shared/
│   │   │   │   ├── components/
│   │   │   │   ├── material/
│   │   │   │   └── mock-data/
│   │   │   ├── layout/
│   │   │   │   └── components/
│   │   │   └── features/
│   │   │       ├── auth/
│   │   │       ├── products/
│   │   │       ├── cart/
│   │   │       ├── checkout/
│   │   │       ├── orders/
│   │   │       └── admin/
│   │   ├── main.ts
│   │   ├── styles.scss
│   │   └── index.html
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
└── server/
    ├── src/
    │   ├── controllers/
    │   ├── routes/
    │   ├── services/
    │   ├── middleware/
    │   ├── models/
    │   ├── config/
    │   └── server.ts
    ├── package.json
    ├── tsconfig.json
    └── .env.example
```

## Features Implemented (Day 1-3)

### Authentication Module
- ✅ User Registration with email and password
- ✅ User Login with Firebase Authentication
- ✅ Protected Routes with Route Guards
- ✅ Auth State Management with Signals
- ✅ Auth Interceptor for API calls
- ✅ User Roles (Customer/Admin)

### Product Module
- ✅ Product Listing Page with filtering by category
- ✅ Product Detail Page
- ✅ Product Card Component (reusable)
- ✅ Mock product data (20+ products)
- ✅ Category management
- ✅ Product search functionality

### Cart Module
- ✅ Add to cart functionality
- ✅ Remove from cart
- ✅ Update quantity
- ✅ Cart state management with Signals
- ✅ Persistent cart storage (localStorage)

### Checkout Module
- ✅ Checkout Page UI
- ✅ Shipping address form
- ✅ Payment method selection
- ✅ Order summary
- ✅ Order creation

### Orders Module
- ✅ Order History page
- ✅ Order tracking
- ✅ Order details view
- ✅ Order status display

### Admin Module
- ✅ Admin Dashboard
- ✅ Statistics cards (Products, Orders, Users, Revenue)
- ✅ Recent orders table
- ✅ Top products list
- ✅ Admin actions

### UI/Layout
- ✅ Header component with navigation
- ✅ Footer component with links
- ✅ Responsive layout
- ✅ Olive green + white theme
- ✅ Material Design principles
- ✅ Mobile-first responsive design

## Data Models

### User
```typescript
{
  uid: string;
  displayName: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  photoURL?: string;
}
```

### Product
```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl: string;
  rating: number;
  reviews?: number;
  createdAt: Date;
}
```

### Order
```typescript
{
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  paymentRef?: string;
  createdAt: Date;
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/current` - Get current user

### Products
- `GET /api/products` - Get all products with pagination
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/categories` - Get all categories
- `POST /api/products` - Create product (Admin only)
- `PATCH /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/all` - Get all orders (Admin)
- `PATCH /api/orders/:id/status` - Update order status (Admin)

## Theme Configuration

### Colors
- **Primary**: Olive Green (#556B2F)
- **Secondary**: White (#FFFFFF)
- **Accent**: Light Olive (#6B8E23)
- **Light Accent**: Yellow Green (#9ACD32)

### Material Design
- Rounded corners (6-12px)
- Box shadows for depth
- Smooth transitions (0.3s ease)
- Responsive grid layouts
- Material Icons throughout

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Frontend Setup

```bash
cd client
npm install

# Development server
ng serve

# Production build
ng build
```

### Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Add Firebase service account JSON

# Development server
npm run dev

# Production build
npm run build
```

### Firebase Configuration

1. Create Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Download service account JSON
5. Add to `.env` file as `FIREBASE_SERVICE_ACCOUNT`

## Installation & Running

### Option 1: Local Development

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
ng serve
```

Visit `http://localhost:4200` in your browser.

### Option 2: Docker

```bash
docker-compose up
```

## Environment Variables

### Server (.env)
```
PORT=3000
FIREBASE_SERVICE_ACCOUNT={JSON_STRING}
NODE_ENV=development
```

### Client (environment.ts)
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID'
  }
};
```

## Security Considerations

- ✅ Protected routes with AuthGuard
- ✅ Admin routes with AdminGuard
- ✅ Firebase Authentication for secure user management
- ✅ Firestore Security Rules for data protection
- ✅ Auth Interceptor for secure API calls
- ✅ Environment-based configuration
- ✅ Input validation on forms
- ✅ CORS configuration

## Performance Optimizations

- ✅ Lazy loading routes
- ✅ Standalone components (reduced bundle size)
- ✅ Signals for reactive state management
- ✅ OnPush change detection strategy (available)
- ✅ Image optimization
- ✅ Code splitting
- ✅ Tree shaking

## Future Enhancements

### Phase 2 (Day 4-5)
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] User profile management
- [ ] Search and advanced filters
- [ ] Product recommendations

### Phase 3 (Day 6-7)
- [ ] Analytics dashboard
- [ ] Inventory management
- [ ] Inventory alerts
- [ ] Shipping integration
- [ ] Multi-currency support
- [ ] Multi-language support
- [ ] Performance monitoring

## Troubleshooting

### Firebase Connection Issues
- Verify service account JSON is correct
- Check Firebase project settings
- Ensure Firestore is enabled
- Check security rules

### Build Issues
- Clear node_modules and reinstall
- Update Angular CLI to latest
- Check TypeScript version compatibility

### Runtime Issues
- Check browser console for errors
- Verify API endpoint URLs
- Check CORS configuration
- Review Firestore security rules

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check documentation
2. Review GitHub issues
3. Contact support team

---

**Last Updated**: June 2024
**Version**: 1.0.0
**Status**: Production Ready for Phase 1
