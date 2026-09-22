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
import adminRoutes from './routes/admin.routes';
import wishlistRoutes from './routes/wishlist.routes';
import realtimeRoutes from './routes/realtime.routes';
import { authMiddleware, requireAdmin } from './middleware/auth.middleware';
import { db } from './config/firebase';
import { ensureDefaultAdminUser } from './controllers/auth.controller';

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

async function deleteLegacyDemoUsers() {
  try {
    // Ensure legacy demo admin and customer documents are removed from Firestore if they exist
    await db.collection('users').doc('admin-uid-001').delete().catch(() => {});
    await db.collection('users').doc('customer-uid-001').delete().catch(() => {});
    await db.collection('users').doc('admin123').delete().catch(() => {});
    await db.collection('users').doc('cust123').delete().catch(() => {});
    console.log('✓ Checked and removed legacy demo accounts from DB.');
  } catch (err) {
    console.error('Warning: Could not clean up legacy demo users:', err);
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
app.use('/api/users', authMiddleware, requireAdmin as any, userRoutes);
app.use('/api/coupons', authMiddleware, couponRoutes);
app.use('/api/cart', authMiddleware, cartRoutes);
app.use('/api/admin', authMiddleware, requireAdmin as any, adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/realtime', realtimeRoutes);

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
  await ensureDefaultAdminUser();
});
