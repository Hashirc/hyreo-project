/**
 * In-Memory Mock Database
 * -----------------------
 * Replaces Firestore + Firebase Auth when no credentials are configured.
 * Stores users (with passwords), products, orders, categories, coupons, reviews.
 * Provides a Firestore-like API surface so controllers don't need to branch.
 */

import crypto from 'crypto';

// ---------- helpers ----------

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateId(): string {
  return crypto.randomBytes(12).toString('hex');
}

function generateToken(uid: string, email: string): string {
  // Simple base64 token – NOT secure, but perfectly fine for a local demo
  const payload = JSON.stringify({ uid, email, iat: Date.now() });
  return Buffer.from(payload).toString('base64');
}

function decodeToken(token: string): { uid: string; email: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return { uid: payload.uid, email: payload.email };
  } catch {
    return null;
  }
}

// ---------- in-memory store ----------

interface MockDocument {
  [key: string]: any;
}

const collections: Record<string, Record<string, MockDocument>> = {};

// Ensure a collection exists
function ensureCollection(name: string) {
  if (!collections[name]) {
    collections[name] = {};
  }
}

// ---------- Firestore-like API ----------

class MockQuerySnapshot {
  docs: MockDocumentSnapshot[];
  empty: boolean;
  constructor(docs: MockDocumentSnapshot[]) {
    this.docs = docs;
    this.empty = docs.length === 0;
  }
}

class MockDocumentSnapshot {
  id: string;
  private _data: MockDocument | null;
  constructor(id: string, data: MockDocument | null) {
    this.id = id;
    this._data = data;
  }
  get exists() {
    return this._data !== null;
  }
  data() {
    return this._data ? { ...this._data } : undefined;
  }
}

class MockDocumentRef {
  private colName: string;
  id: string;

  constructor(colName: string, id: string) {
    this.colName = colName;
    this.id = id;
    ensureCollection(colName);
  }

  async get(): Promise<MockDocumentSnapshot> {
    const data = collections[this.colName][this.id] || null;
    return new MockDocumentSnapshot(this.id, data);
  }

  async set(data: MockDocument): Promise<void> {
    collections[this.colName][this.id] = { ...data };
  }

  async update(data: Partial<MockDocument>): Promise<void> {
    if (!collections[this.colName][this.id]) {
      throw new Error(`Document ${this.id} not found in ${this.colName}`);
    }
    collections[this.colName][this.id] = {
      ...collections[this.colName][this.id],
      ...data,
    };
  }

  async delete(): Promise<void> {
    delete collections[this.colName][this.id];
  }
}

class MockCollectionRef {
  private colName: string;

  constructor(colName: string) {
    this.colName = colName;
    ensureCollection(colName);
  }

  doc(id: string): MockDocumentRef {
    return new MockDocumentRef(this.colName, id);
  }

  async add(data: MockDocument): Promise<MockDocumentRef> {
    const id = generateId();
    ensureCollection(this.colName);
    collections[this.colName][id] = { ...data };
    return new MockDocumentRef(this.colName, id);
  }

  async get(): Promise<MockQuerySnapshot> {
    ensureCollection(this.colName);
    const docs = Object.entries(collections[this.colName]).map(
      ([id, data]) => new MockDocumentSnapshot(id, data)
    );
    return new MockQuerySnapshot(docs);
  }

  where(field: string, op: string, value: any): MockQuery {
    return new MockQuery(this.colName, [{ field, op, value }]);
  }
}

class MockQuery {
  private colName: string;
  private filters: Array<{ field: string; op: string; value: any }>;

  constructor(colName: string, filters: Array<{ field: string; op: string; value: any }>) {
    this.colName = colName;
    this.filters = filters;
  }

  where(field: string, op: string, value: any): MockQuery {
    return new MockQuery(this.colName, [...this.filters, { field, op, value }]);
  }

  async get(): Promise<MockQuerySnapshot> {
    ensureCollection(this.colName);
    const allDocs = Object.entries(collections[this.colName]);
    const matched = allDocs.filter(([_id, data]) => {
      return this.filters.every((f) => {
        const fieldValue = data[f.field];
        switch (f.op) {
          case '==':
            return fieldValue === f.value;
          case '!=':
            return fieldValue !== f.value;
          case '>':
            return fieldValue > f.value;
          case '<':
            return fieldValue < f.value;
          default:
            return fieldValue === f.value;
        }
      });
    });
    return new MockQuerySnapshot(
      matched.map(([id, data]) => new MockDocumentSnapshot(id, data))
    );
  }
}

// ---------- Mock Firestore (db) ----------

export const mockDb = {
  collection(name: string): MockCollectionRef {
    return new MockCollectionRef(name);
  },
};

// ---------- Mock Firebase Auth ----------

export const mockAuth = {
  async createUser(properties: { email: string; password?: string; displayName?: string }) {
    const uid = generateId();
    // Also store in the internal passwords map
    if (properties.password) {
      passwordStore[properties.email] = hashPassword(properties.password);
    }
    return {
      uid,
      email: properties.email,
      displayName: properties.displayName || '',
    };
  },

  async verifyIdToken(token: string) {
    const decoded = decodeToken(token);
    if (!decoded) throw new Error('Invalid token');
    return decoded;
  },

  async getUser(uid: string) {
    ensureCollection('users');
    const userData = collections['users'][uid];
    if (!userData) throw new Error('User not found');
    return { uid, email: userData.email, displayName: userData.displayName };
  },
};

// ---------- Password store (separate from Firestore docs) ----------

const passwordStore: Record<string, string> = {};

export function setPassword(email: string, password: string) {
  passwordStore[email] = hashPassword(password);
}

export function verifyPassword(email: string, password: string): boolean {
  const stored = passwordStore[email];
  if (!stored) return false;
  return stored === hashPassword(password);
}

export { generateToken, decodeToken, generateId };

// ---------- Seed default users ----------

function seedDefaults() {
  ensureCollection('users');

  // Admin user
  const adminUid = 'admin-uid-001';
  collections['users'][adminUid] = {
    uid: adminUid,
    email: 'admin@olive.com',
    displayName: 'Admin User',
    role: 'admin',
    createdAt: new Date(),
  };
  passwordStore['admin@olive.com'] = hashPassword('password123');

  // Customer user
  const customerUid = 'customer-uid-001';
  collections['users'][customerUid] = {
    uid: customerUid,
    email: 'customer@olive.com',
    displayName: 'Demo Customer',
    role: 'customer',
    createdAt: new Date(),
  };
  passwordStore['customer@olive.com'] = hashPassword('password123');

  console.log('✓ Mock DB seeded with default users:');
  console.log('  • admin@olive.com / password123 (Admin)');
  console.log('  • customer@olive.com / password123 (Customer)');
}

seedDefaults();
