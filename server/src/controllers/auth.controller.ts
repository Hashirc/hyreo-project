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

export async function ensureDefaultAdminUser() {
  try {
    const existingAdmin = await db.collection('users').where('email', '==', 'admin@olive.com').get();
    if (existingAdmin.empty) {
      const adminUid = 'admin-default-001';
      const adminUser = {
        uid: adminUid,
        email: 'admin@olive.com',
        displayName: 'Olive Admin',
        role: 'admin',
        createdAt: new Date(),
        _pwdHash: hashPwd('password123')
      };
      await db.collection('users').doc(adminUid).set(adminUser);
      if (useMockDb) {
        setPassword('admin@olive.com', 'password123');
      }
      console.log('✓ Seeded default admin account: admin@olive.com / password123');
    }
  } catch (err) {
    console.error('Error ensuring default admin user:', err);
  }
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
    const { email, password, role } = req.body;

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

export async function updateProfile(req: Request, res: Response) {
  try {
    const { displayName, email, phone, dob, gender, photoURL } = req.body;
    const authReq = req as any;
    const uid = authReq.user?.uid;

    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address format' });
      }

      const existing = await db.collection('users').where('email', '==', email).get();
      const otherUser = existing.docs.find((doc: any) => doc.id !== uid);
      if (otherUser) {
        return res.status(400).json({ error: 'An account with this email already exists.' });
      }
    }

    if (phone) {
      const phoneRegex = /^[+]?[0-9\s-]{10,15}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
      }
    }

    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData: any = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (dob !== undefined) updateData.dob = dob;
    if (gender !== undefined) updateData.gender = gender;
    if (photoURL !== undefined) updateData.photoURL = photoURL;
    updateData.updatedAt = new Date();

    await userDocRef.update(updateData);

    const updatedDoc = await userDocRef.get();
    const data = { ...updatedDoc.data() };
    delete data['_pwdHash'];

    return res.json({
      user: { id: updatedDoc.id, ...data }
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;
    const authReq = req as any;
    const uid = authReq.user?.uid;

    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data() as any;
    const currentHash = userData._pwdHash;

    if (currentHash && !checkPwd(currentPassword, currentHash)) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    const newHash = hashPwd(newPassword);
    await userDocRef.update({
      _pwdHash: newHash,
      updatedAt: new Date()
    });

    if (useMockDb) {
      setPassword(userData.email, newPassword);
    }

    return res.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({ error: error.message || 'Failed to change password' });
  }
}

export async function updateAddresses(req: Request, res: Response) {
  try {
    const { addresses } = req.body;
    const authReq = req as any;
    const uid = authReq.user?.uid;

    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!Array.isArray(addresses)) {
      return res.status(400).json({ error: 'Addresses must be an array' });
    }

    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    await userDocRef.update({
      addresses,
      updatedAt: new Date()
    });

    const updatedDoc = await userDocRef.get();
    const data = { ...updatedDoc.data() };
    delete data['_pwdHash'];

    return res.json({
      user: { id: updatedDoc.id, ...data }
    });
  } catch (error: any) {
    console.error('Update addresses error:', error);
    res.status(500).json({ error: error.message || 'Failed to update addresses' });
  }
}

export async function checkAdminExists(req: Request, res: Response) {
  try {
    const existing = await db.collection('users').where('role', '==', 'admin').get();
    return res.json({ exists: !existing.empty });
  } catch (error: any) {
    console.error('Check admin exists error:', error);
    res.status(500).json({ error: 'Failed to check admin status' });
  }
}

export async function registerAdmin(req: Request, res: Response) {
  try {
    const { displayName, username, email, password, secretKey } = req.body;

    if (!displayName || !username || !email || !password || !secretKey) {
      return res.status(400).json({ error: 'All fields (Name, Username, Email, Password, Secret Key) are required.' });
    }

    // 1. Check if admin already exists
    const existing = await db.collection('users').where('role', '==', 'admin').get();
    if (!existing.empty) {
      return res.status(400).json({ error: 'Admin account already exists. Please log in.' });
    }

    // 2. Validate Secret Key
    if (secretKey !== 'OWNER2026ADMIN') {
      return res.status(400).json({ error: 'Invalid secret key.' });
    }

    // 3. Validate password length
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    // 4. Validate email uniqueness
    const emailCheck = await db.collection('users').where('email', '==', email).get();
    if (!emailCheck.empty) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // 5. Validate username uniqueness
    const usernameCheck = await db.collection('users').where('username', '==', username).get();
    if (!usernameCheck.empty) {
      return res.status(400).json({ error: 'An account with this username already exists.' });
    }

    const uid = generateId();
    const user = {
      uid,
      displayName,
      username,
      email,
      role: 'admin',
      createdAt: new Date(),
      _pwdHash: hashPwd(password)
    };

    await db.collection('users').doc(uid).set(user);

    if (useMockDb) {
      setPassword(email, password);
      setPassword(username, password);
    }

    const token = makeToken(uid, email);

    return res.status(201).json({
      user: { uid, email, username, displayName, role: 'admin' },
      token
    });
  } catch (error: any) {
    console.error('Register admin error:', error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
}

export async function loginAdmin(req: Request, res: Response) {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required.' });
    }

    // Look up by email
    let userSnapshot = await db.collection('users').where('email', '==', usernameOrEmail).get();
    
    // Look up by username if email search was empty
    if (userSnapshot.empty) {
      userSnapshot = await db.collection('users').where('username', '==', usernameOrEmail).get();
    }

    if (userSnapshot.empty) {
      return res.status(401).json({ error: 'Incorrect username/email or password.' });
    }

    const doc = userSnapshot.docs[0];
    const userData = doc.data() as any;

    if (userData.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    }

    // Validate password
    let valid = false;
    if (userData._pwdHash) {
      valid = checkPwd(password, userData._pwdHash);
    } else if (useMockDb) {
      valid = verifyPassword(userData.email, password) || verifyPassword(userData.username, password);
    }

    if (!valid) {
      return res.status(401).json({ error: 'Incorrect username/email or password.' });
    }

    const token = makeToken(userData.uid, userData.email);

    return res.json({
      user: {
        uid: userData.uid,
        email: userData.email,
        username: userData.username,
        displayName: userData.displayName,
        role: userData.role
      },
      token
    });
  } catch (error: any) {
    console.error('Admin login error:', error);
    res.status(400).json({ error: error.message || 'Login failed' });
  }
}
