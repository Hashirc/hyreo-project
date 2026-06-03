"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.requireAdmin = requireAdmin;
const firebase_1 = require("../config/firebase");
const dbService_1 = require("../services/dbService");
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }
    if (firebase_1.useMockDb) {
        // Handle mock tokens for testing
        if (token === 'mock-admin-token') {
            req.user = {
                uid: 'admin123',
                email: 'admin@olive.com',
                role: 'admin',
                displayName: 'Olive Admin'
            };
            return next();
        }
        else if (token.startsWith('mock-customer-token') || token === 'mock-user-token') {
            req.user = {
                uid: 'cust123',
                email: 'customer@olive.com',
                role: 'customer',
                displayName: 'John Doe'
            };
            return next();
        }
        else {
            // Decode mock uid from token structure: mock-token-[uid]
            const parts = token.split('-');
            const mockUid = parts[parts.length - 1] || 'cust123';
            const user = await (0, dbService_1.dbGetUser)(mockUid);
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
        const decodedToken = await firebase_1.auth.verifyIdToken(token);
        const userProfile = await (0, dbService_1.dbGetUser)(decodedToken.uid);
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
    }
    catch (error) {
        console.error('Token verification failed:', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }
    next();
}
