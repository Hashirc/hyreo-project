import { Request, Response, NextFunction } from 'express';
import { db } from '../config/firebase';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role?: 'customer' | 'admin';
  };
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      // Demo store: allow requests without token to pass through
      // Controllers will decide whether to reject or assign guest identities
      return next();
    }

    // Decode our base64 token (works in both real Firestore + mock modes)
    let decoded: { uid: string; email: string } | null = null;
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (!payload.uid || !payload.email) throw new Error('Invalid payload');
      decoded = { uid: payload.uid, email: payload.email };
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Fetch user profile from DB to retrieve the role
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    let role: 'customer' | 'admin' = 'customer';
    if (userDoc.exists) {
      role = userDoc.data()?.role || 'customer';
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: role
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
}
