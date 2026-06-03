"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getCurrentUserProfile = getCurrentUserProfile;
const dbService_1 = require("../services/dbService");
const firebase_1 = require("../config/firebase");
async function registerUser(req, res) {
    try {
        const { email, displayName, password, role } = req.body;
        if (!email || !displayName) {
            return res.status(400).json({ message: 'Email and Display Name are required.' });
        }
        const assignedRole = role === 'admin' ? 'admin' : 'customer';
        if (firebase_1.useMockDb) {
            // For mock: generate random uid if password is dummy, or use a hashed value
            const mockUid = 'user_' + Math.random().toString(36).substr(2, 9);
            const newUser = {
                uid: mockUid,
                displayName,
                email,
                role: assignedRole,
                createdAt: new Date()
            };
            await (0, dbService_1.dbCreateUser)(newUser);
            // Return a simulated mock token
            return res.status(201).json({
                message: 'Mock registration successful',
                user: newUser,
                token: `mock-customer-token-${mockUid}`
            });
        }
        // Real Firebase Auth user creation
        if (!password) {
            return res.status(400).json({ message: 'Password is required for registration.' });
        }
        const userRecord = await firebase_1.auth.createUser({
            email,
            password,
            displayName,
        });
        // Set custom claims for admin
        if (assignedRole === 'admin') {
            await firebase_1.auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });
        }
        else {
            await firebase_1.auth.setCustomUserClaims(userRecord.uid, { role: 'customer' });
        }
        const newUser = {
            uid: userRecord.uid,
            displayName,
            email,
            role: assignedRole,
            createdAt: new Date()
        };
        await (0, dbService_1.dbCreateUser)(newUser);
        return res.status(201).json({
            message: 'Registration successful',
            user: newUser
        });
    }
    catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
}
async function loginUser(req, res) {
    try {
        const { email, token } = req.body;
        // Standard flow: Frontend authenticates directly with Firebase, then posts ID token to /api/auth/login
        // to sync user profile and return role
        if (!token) {
            return res.status(400).json({ message: 'Firebase ID token is required' });
        }
        if (firebase_1.useMockDb) {
            // In Mock Mode, if email is provided, let's find or create a mock user
            let user = null;
            if (email) {
                // Find existing user or check predefined mock users
                const mockEmail = email.toLowerCase();
                if (mockEmail === 'admin@olive.com') {
                    user = await (0, dbService_1.dbGetUser)('admin123');
                }
                else if (mockEmail === 'customer@olive.com') {
                    user = await (0, dbService_1.dbGetUser)('cust123');
                }
            }
            if (!user) {
                // fallback user
                user = {
                    uid: 'cust123',
                    displayName: 'John Doe',
                    email: email || 'customer@olive.com',
                    role: email?.includes('admin') ? 'admin' : 'customer',
                    createdAt: new Date()
                };
                await (0, dbService_1.dbCreateUser)(user);
            }
            const mockToken = user.role === 'admin' ? 'mock-admin-token' : `mock-customer-token-${user.uid}`;
            return res.status(200).json({
                message: 'Mock login successful',
                user,
                token: mockToken
            });
        }
        // Verify token
        const decodedToken = await firebase_1.auth.verifyIdToken(token);
        let user = await (0, dbService_1.dbGetUser)(decodedToken.uid);
        if (!user) {
            // If user exists in Auth but not in Firestore yet, create profile
            user = {
                uid: decodedToken.uid,
                displayName: decodedToken.name || 'User',
                email: decodedToken.email || '',
                role: decodedToken.role === 'admin' ? 'admin' : 'customer',
                createdAt: new Date()
            };
            await (0, dbService_1.dbCreateUser)(user);
        }
        return res.status(200).json({
            message: 'Login verified',
            user
        });
    }
    catch (error) {
        console.error('Error logging in user:', error);
        return res.status(401).json({ message: error.message || 'Unauthorized token' });
    }
}
async function getCurrentUserProfile(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await (0, dbService_1.dbGetUser)(req.user.uid);
        if (!user) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
}
