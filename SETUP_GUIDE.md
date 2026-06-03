# HYREO E-Commerce - Complete Setup & Development Guide

## Project Overview

HYREO is a full-stack e-commerce application built with:
- **Frontend**: Angular 20 (Standalone Components, Signals)
- **Backend**: Node.js + Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Theme**: Olive Green (#556B2F) & White

## ✅ Completed Features (Day 1-3)

### Phase 1: Foundation & Authentication
- ✅ Project structure setup
- ✅ Angular Material theme configuration
- ✅ Firebase Admin SDK integration
- ✅ User registration & login pages
- ✅ Email/password authentication
- ✅ Auth guards for protected routes
- ✅ Auth interceptor for API calls
- ✅ User role management (customer/admin)

### Phase 2: Product Management
- ✅ Product listing page with filtering
- ✅ Product detail page
- ✅ Reusable product card component
- ✅ 20+ mock products with real images
- ✅ Category filtering
- ✅ Product search functionality
- ✅ Product API endpoints (CRUD)

### Phase 3: Shopping Experience
- ✅ Add to cart functionality
- ✅ Cart state management with Signals
- ✅ Persistent cart storage
- ✅ Checkout page UI
- ✅ Shipping address form
- ✅ Payment method selection
- ✅ Order creation

### Phase 4: User Features
- ✅ Order history page
- ✅ Order tracking UI
- ✅ Order status display
- ✅ User profile page UI

### Phase 5: Admin Features
- ✅ Admin dashboard
- ✅ Statistics cards (Products, Orders, Users, Revenue)
- ✅ Recent orders table
- ✅ Top products list
- ✅ Admin guard protection

### Phase 6: UI/Layout
- ✅ Header component with navigation
- ✅ Footer component
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Olive green + white theme
- ✅ Material Design principles
- ✅ Smooth animations & transitions

## 📁 Project Structure

```
hyreo-project/
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── models/          [User, Product, Order, Cart models]
│   │   │   │   ├── services/        [Auth, Product, Order, Cart services]
│   │   │   │   ├── guards/          [Auth, Admin, Public guards]
│   │   │   │   └── interceptors/    [Auth interceptor]
│   │   │   ├── shared/
│   │   │   │   ├── components/      [Product card, shared UI]
│   │   │   │   ├── material/        [Theme configuration]
│   │   │   │   └── mock-data/       [20+ products for demo]
│   │   │   ├── layout/
│   │   │   │   └── components/      [Header, Footer]
│   │   │   ├── features/
│   │   │   │   ├── auth/            [Login, Register pages]
│   │   │   │   ├── products/        [Product listing & detail]
│   │   │   │   ├── cart/            [Cart service]
│   │   │   │   ├── checkout/        [Checkout page]
│   │   │   │   ├── orders/          [Order history]
│   │   │   │   └── admin/           [Admin dashboard]
│   │   │   ├── app.component.ts     [Main layout]
│   │   │   ├── app.routes.ts        [Routing]
│   │   │   └── app.config.ts        [Config]
│   │   ├── main.ts                  [Bootstrap]
│   │   ├── styles.scss              [Global styles]
│   │   └── index.html
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   └── tsconfig.app.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts   [Register, login]
│   │   │   ├── product.controller.ts [CRUD products]
│   │   │   └── order.controller.ts   [CRUD orders]
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── product.routes.ts
│   │   │   └── order.routes.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts   [JWT verification]
│   │   ├── models/
│   │   │   └── index.ts             [TypeScript interfaces]
│   │   └── server.ts                [Express setup]
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                         [Project documentation]
```

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+
npm or yarn
Firebase account
```

### Step 1: Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file
cp src/environments/environment.example.ts src/environments/environment.ts

# Update Firebase config in main.ts
# Replace with your Firebase credentials

# Start dev server
ng serve --open

# Access at http://localhost:4200
```

### Step 2: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add Firebase Service Account JSON to .env
# Generate from Firebase Console > Project Settings > Service Accounts

# Start server
npm run dev

# Server runs at http://localhost:3000
# Health check: http://localhost:3000/api/health
```

### Step 3: Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project named "hyreo-ecommerce"
3. Enable Authentication (Email/Password)
4. Create Firestore Database (Start in test mode)
5. Download Service Account JSON
6. Add to server/.env file

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/current       - Get current user
```

### Products
```
GET    /api/products           - Get all products (paginated)
GET    /api/products/:id       - Get product by ID
GET    /api/products/categories - Get all categories
POST   /api/products           - Create product (Admin)
PATCH  /api/products/:id       - Update product (Admin)
DELETE /api/products/:id       - Delete product (Admin)
```

### Orders
```
POST   /api/orders             - Create order
GET    /api/orders             - Get user orders
GET    /api/orders/:id         - Get order by ID
GET    /api/orders/all         - Get all orders (Admin)
PATCH  /api/orders/:id/status  - Update status (Admin)
```

## 🎨 Theme Configuration

### Colors
- **Primary**: `#556B2F` (Olive Green)
- **Secondary**: `#FFFFFF` (White)
- **Accent**: `#6B8E23` (Light Olive)
- **Light Accent**: `#9ACD32` (Yellow Green)
- **Dark Primary**: `#3d4d1f` (Dark Olive)

### CSS Variables
All colors available as CSS variables in `styles.scss`:
```scss
--primary-color: #556B2F
--secondary-color: #FFFFFF
--accent-color: #6B8E23
```

## 🔐 Security Features

- ✅ Firebase Authentication
- ✅ Auth Guards (Protect routes)
- ✅ Admin Guards (Role-based access)
- ✅ Auth Interceptor (Auto token injection)
- ✅ Environment-based config
- ✅ Firestore Security Rules
- ✅ CORS enabled
- ✅ Input validation

## 📱 Responsive Design

- ✅ Desktop (1920px+)
- ✅ Laptop (1200px)
- ✅ Tablet (768px)
- ✅ Mobile (480px)
- ✅ Flexible grid layouts
- ✅ Mobile-first approach

## 🛠️ Development Commands

### Frontend
```bash
# Development server
ng serve

# Build for production
ng build --prod

# Run unit tests
ng test

# Run end-to-end tests
ng e2e

# Code linting
ng lint
```

### Backend
```bash
# Development server with auto-reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🧪 Mock Data

The application includes 20+ mock products across 4 categories:

### Categories
1. **Electronics** - Phones, laptops, headphones, smartwatches
2. **Fashion** - T-shirts, jeans, jackets, sneakers, backpacks
3. **Home & Living** - Coffee makers, lamps, bed sheets, plants
4. **Sports** - Yoga mats, running shoes, dumbbells, basketballs

All products include:
- Real Unsplash images
- Detailed descriptions
- Prices ($24.99 - $1299.99)
- Ratings (4.2 - 4.8 stars)
- Stock quantities
- Product specifications

## 📖 User Roles

### Customer
- View products
- Filter & search
- Add to cart
- Checkout
- Place orders
- View order history
- Track orders

### Admin
- View all products
- Create products
- Edit products
- Delete products
- View all orders
- Update order status
- View analytics

## 🔄 User Flow

### New User
1. Register page → Create account
2. Redirects to home page
3. Browse products
4. Add to cart
5. Proceed to checkout
6. Enter shipping info
7. Select payment method
8. Place order

### Existing User
1. Login page → Enter credentials
2. Redirects to home page
3. Same flow as new user

### Admin
1. Login with admin account
2. Navigate to Admin Dashboard
3. View statistics
4. Manage products & orders

## 🎯 Key Features

### For Customers
- **Search & Filter**: Find products quickly
- **Product Details**: Full specifications & reviews
- **Shopping Cart**: Persistent across sessions
- **Checkout**: Simple 2-step process
- **Order Tracking**: Real-time status updates
- **User Profile**: Manage account info

### For Admins
- **Dashboard**: Real-time statistics
- **Product Management**: CRUD operations
- **Order Management**: Update status & tracking
- **Analytics**: Revenue & user insights
- **Reports**: Export data

## 📈 Performance

- ✅ Lazy loading routes
- ✅ Standalone components (smaller bundle)
- ✅ Signals (reactive updates)
- ✅ Image optimization
- ✅ Code splitting
- ✅ Tree shaking
- ✅ OnPush detection strategy

## 🐛 Troubleshooting

### Firebase Connection Issues
```
1. Verify service account JSON
2. Check project settings
3. Ensure Firestore is enabled
4. Review security rules
5. Check CORS settings
```

### Build Errors
```
1. Clear node_modules
2. npm install again
3. Check Node version (18+)
4. Update Angular CLI
5. Check TypeScript version
```

### Runtime Errors
```
1. Check browser console
2. Verify API endpoints
3. Check interceptor
4. Review Firestore rules
5. Check environment config
```

## 📚 Documentation

- `/README.md` - Project overview
- `/client/README.md` - Frontend setup
- `/server/README.md` - Backend setup
- Code comments throughout

## 🔗 Useful Links

- [Angular Documentation](https://angular.io)
- [Angular Material](https://material.angular.io)
- [Firebase Docs](https://firebase.google.com/docs)
- [Express.js](https://expressjs.com)
- [TypeScript](https://www.typescriptlang.org)

## 📝 Version Info

- **Angular**: 20+
- **TypeScript**: 5.0+
- **Node.js**: 18+
- **Firebase**: Latest
- **Material**: Latest
- **Express**: 4.18+

## 👥 Team

Built by: HYREO Development Team

## 📄 License

MIT License - Open source

## 🎉 What's Next?

### Phase 2 (Coming Soon)
- Payment gateway integration
- Email notifications
- Product reviews
- Wishlist feature
- User profile management

### Phase 3 (Future)
- Admin analytics
- Inventory management
- Multi-currency support
- Mobile app
- Advanced search

---

**Status**: ✅ Phase 1 Complete (Ready for Day 3 Deployment)
**Last Updated**: June 2024
