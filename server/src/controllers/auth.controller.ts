import { Request, Response } from 'express';
import { db, useMockDb } from '../config/firebase';
import { User } from '../models/index';
import { verifyPassword, setPassword, generateToken, generateId } from '../config/mockdb';
import crypto from 'crypto';

// ---- Password helpers (work for both real Firestore + mock DB) ----
function hashPwd(password: string): string {
  return crypto.createHash('sha256').update(password + 'olive-salt-2024').digest('hex');
}

function checkPwd(password: string, hash: string): boolean {
  return hashPwd(password) === hash;
}

function makeToken(uid: string, email: string): string {
  const payload = JSON.stringify({ uid, email, iat: Date.now() });
  return Buffer.from(payload).toString('base64');
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, displayName, role } = req.body;

    if (!email || !displayName || !password) {
      return res.status(400).json({ error: 'Name, email and password are all required.' });
    }

    // Check if email already exists
    const existing = await db.collection('users').where('email', '==', email).get();
    if (!existing.empty) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const uid = useMockDb ? generateId() : generateId();
    const userRole: 'customer' | 'admin' = role === 'admin' ? 'admin' : 'customer';

    const user: User & { _pwdHash?: string } = {
      uid,
      email,
      displayName,
      role: userRole,
      createdAt: new Date(),
      _pwdHash: hashPwd(password),   // store hashed password in the same doc
    };

    await db.collection('users').doc(uid).set(user);

    // Also register in mock password store if in mock mode
    if (useMockDb) {
      setPassword(email, password);
    }

    const token = makeToken(uid, email);

    return res.status(201).json({
      user: { uid, email, displayName, role: userRole },
      token,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    // Look up user in Firestore / mock DB
    const userSnapshot = await db.collection('users').where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(401).json({ error: 'No account found with this email.' });
    }

    const doc = userSnapshot.docs[0];
    const userData = doc.data() as User & { _pwdHash?: string };

    // Validate password if provided (form login)
    if (password) {
      let valid = false;

      if (userData._pwdHash) {
        // Preferred: hash stored in Firestore doc
        valid = checkPwd(password, userData._pwdHash);
      } else if (useMockDb) {
        // Fallback: check mock password store (seeded users)
        valid = verifyPassword(email, password);
      }

      if (!valid) {
        return res.status(401).json({ error: 'Incorrect password. Please try again.' });
      }
    }

    const token = makeToken(userData.uid, email);

    return res.json({
      user: {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
      },
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message || 'Login failed' });
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Decode our base64 token
    let decoded: { uid: string; email: string } | null = null;
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      decoded = { uid: payload.uid, email: payload.email };
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userDoc = await db.collection('users').doc(decoded.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const data = { ...userDoc.data() };
    delete data['_pwdHash'];  // never expose the password hash

    res.json({ id: userDoc.id, ...data });
  } catch (error: any) {
    console.error('Get current user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}
