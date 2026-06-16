import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import userRoutes from './routes/user.routes';
import couponRoutes from './routes/coupon.routes';
import cartRoutes from './routes/cart.routes';
import { authMiddleware } from './middleware/auth.middleware';
import { db } from './config/firebase';
import { seedDb } from './services/dbService';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ---- Seed default users into DB on startup ----
function hashPwd(password: string): string {
  return crypto.createHash('sha256').update(password + 'olive-salt-2024').digest('hex');
}

async function seedDefaultUsers() {
  try {
    const adminEmail = 'admin@olive.com';
    const customerEmail = 'customer@olive.com';

    // Check if admin already exists
    const adminSnap = await db.collection('users').where('email', '==', adminEmail).get();
    if (adminSnap.empty) {
      await db.collection('users').doc('admin-uid-001').set({
        uid: 'admin-uid-001',
        email: adminEmail,
        displayName: 'Admin User',
        role: 'admin',
        createdAt: new Date(),
        _pwdHash: hashPwd('password123'),
      });
      console.log('✓ Admin user seeded: admin@olive.com / password123');
    } else {
      console.log('✓ Admin user already exists in DB.');
    }

    // Check if customer already exists
    const custSnap = await db.collection('users').where('email', '==', customerEmail).get();
    if (custSnap.empty) {
      await db.collection('users').doc('customer-uid-001').set({
        uid: 'customer-uid-001',
        email: customerEmail,
        displayName: 'Demo Customer',
        role: 'customer',
        createdAt: new Date(),
        _pwdHash: hashPwd('password123'),
      });
      console.log('✓ Customer user seeded: customer@olive.com / password123');
    } else {
      console.log('✓ Customer user already exists in DB.');
    }
  } catch (err) {
    console.error('Warning: Could not seed default users:', err);
  }
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Request logger for debugging
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path.startsWith('/api/orders') || req.path.startsWith('/api/auth')) {
    console.log(`[REQUEST] ${req.method} ${req.path} | Auth: ${req.headers.authorization ? 'present' : 'MISSING'} | Body keys: ${Object.keys(req.body || {}).join(',')}`);
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', authMiddleware, orderRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/coupons', authMiddleware, couponRoutes);
app.use('/api/cart', authMiddleware, cartRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
  await seedDefaultUsers();
  await seedDb();
});
