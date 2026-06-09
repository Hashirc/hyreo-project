import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
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

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
