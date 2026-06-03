import { Request, Response } from 'express';
import { auth, db } from '../server.js';
import { User } from '../models/index.js';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName
    });

    // Store user in Firestore
    const user: User = {
      uid: userRecord.uid,
      email: userRecord.email || '',
      displayName,
      role: 'customer',
      createdAt: new Date()
    };

    await db.collection('users').doc(userRecord.uid).set(user);

    res.status(201).json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName,
      role: 'customer'
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Get user from Firestore
    const userSnapshot = await db.collection('users').where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(401).json({ error: 'User not found' });
    }

    const userData = userSnapshot.docs[0].data() as User;

    res.json({
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role
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

    const decodedToken = await auth.verifyIdToken(token);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: userDoc.id,
      ...userDoc.data()
    });
  } catch (error: any) {
    console.error('Get current user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}
