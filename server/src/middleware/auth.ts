import { Request, Response, NextFunction } from 'express';
import { auth, useMockDb } from '../config/firebase';
import { dbGetUser } from '../services/dbService';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    role: 'customer' | 'admin';
    displayName?: string;
  };
}

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  if (useMockDb) {
    // Handle mock tokens for testing
    if (token === 'mock-admin-token') {
      req.user = {
        uid: 'admin123',
        email: 'admin@olive.com',
        role: 'admin',
        displayName: 'Olive Admin'
      };
      return next();
    } else if (token.startsWith('mock-customer-token') || token === 'mock-user-token') {
      req.user = {
        uid: 'cust123',
        email: 'customer@olive.com',
        role: 'customer',
        displayName: 'John Doe'
      };
      return next();
    } else {
      // Decode mock uid from token structure: mock-token-[uid]
      const parts = token.split('-');
      const mockUid = parts[parts.length - 1] || 'cust123';
      const user = await dbGetUser(mockUid);
      if (user) {
        req.user = {
          uid: user.uid,
          email: user.email,
          role: user.role,
          displayName: user.displayName
        };
        return next();
      }
      return res.status(403).json({ message: 'Invalid mock token' });
    }
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const userProfile = await dbGetUser(decodedToken.uid);

    if (!userProfile) {
      return res.status(403).json({ message: 'User profile not found' });
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || userProfile.email,
      role: userProfile.role,
      displayName: userProfile.displayName || decodedToken.name
    };

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
  }
  next();
}
