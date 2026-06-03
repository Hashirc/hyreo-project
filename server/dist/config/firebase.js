"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMockDb = exports.auth = exports.db = exports.admin = void 0;
const admin = __importStar(require("firebase-admin"));
exports.admin = admin;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let db = null;
exports.db = db;
let auth = null;
exports.auth = auth;
let useMockDb = false;
exports.useMockDb = useMockDb;
try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (serviceAccountPath) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountPath),
            databaseURL: `https://${projectId}.firebaseio.com`
        });
        exports.db = db = admin.firestore();
        exports.auth = auth = admin.auth();
        console.log('Firebase Admin SDK initialized successfully via service account file.');
    }
    else if (privateKey && clientEmail && projectId) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
            databaseURL: `https://${projectId}.firebaseio.com`
        });
        exports.db = db = admin.firestore();
        exports.auth = auth = admin.auth();
        console.log('Firebase Admin SDK initialized successfully via credentials env.');
    }
    else {
        // If no Firebase credentials, set flag to use in-memory Mock DB for testing Day 3 features.
        exports.useMockDb = useMockDb = true;
        console.warn('No Firebase credentials found. Running in MOCK DB MODE.');
    }
}
catch (error) {
    console.error('Failed to initialize Firebase Admin SDK. Falling back to MOCK DB MODE.', error);
    exports.useMockDb = useMockDb = true;
}
