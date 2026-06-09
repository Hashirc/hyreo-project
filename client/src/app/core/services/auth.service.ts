import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../models/types';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Angular Signals for Authentication state
  readonly currentUser = signal<User | null>(null);
  readonly token = signal<string | null>(localStorage.getItem('auth_token'));
  
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  private auth: any = null;
  private isFirebaseMock = true;

  constructor() {
    // Attempt to initialize Firebase Client SDK unless dummy credentials are used
    if (environment.firebase && environment.firebase.apiKey && environment.firebase.apiKey !== 'mock-api-key') {
      try {
        const app = initializeApp(environment.firebase);
        this.auth = getAuth(app);
        this.isFirebaseMock = false;
        console.log('Firebase Client SDK initialized.');
        
        // Listen to auth changes
        onAuthStateChanged(this.auth, async (fbUser: FirebaseUser | null) => {
          if (fbUser) {
            const idToken = await fbUser.getIdToken();
            this.setToken(idToken);
            this.syncWithBackend(fbUser.email || '', idToken);
          } else {
            this.clearSession();
          }
        });
      } catch (err) {
        console.error('Firebase Auth failed to initialize, running in mock auth mode.', err);
      }
    }

    if (this.isFirebaseMock) {
      console.log('Running in client MOCK AUTH MODE.');
      this.restoreMockSession();
    }
  }

  private setToken(val: string | null) {
    this.token.set(val);
    if (val) {
      localStorage.setItem('auth_token', val);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private clearSession() {
    this.currentUser.set(null);
    this.setToken(null);
    localStorage.removeItem('user_profile');
  }

  private restoreMockSession() {
    const savedUser = localStorage.getItem('user_profile');
    const token = this.token();
    if (savedUser && token) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
      } catch {
        this.clearSession();
      }
    }
  }

  private async syncWithBackend(email: string, idToken: string) {
    this.http.post<{ user: User, token: string }>(`${environment.apiUrl}/auth/login`, { email, token: idToken })
      .subscribe({
        next: (res) => {
          this.currentUser.set(res.user);
          localStorage.setItem('user_profile', JSON.stringify(res.user));
        },
        error: (err) => {
          console.error('Failed to sync user with backend:', err);
          this.clearSession();
        }
      });
  }

  async login(email: string, password: string): Promise<any> {
    if (this.isFirebaseMock) {
      // Mock Client Login — send email + password to server for validation
      return new Promise((resolve, reject) => {
        this.http.post<{ user: User, token: string }>(`${environment.apiUrl}/auth/login`, {
          email,
          password,
        }).subscribe({
          next: (res) => {
            this.currentUser.set(res.user);
            this.setToken(res.token);
            localStorage.setItem('user_profile', JSON.stringify(res.user));
            resolve(res.user);
          },
          error: (err) => {
            reject(err.error || { message: 'Invalid credentials' });
          }
        });
      });
    }

    // Real Firebase Login
    const credentials = await signInWithEmailAndPassword(this.auth, email, password);
    const idToken = await credentials.user.getIdToken();
    this.setToken(idToken);
    return new Promise((resolve, reject) => {
      this.http.post<{ user: User, token: string }>(`${environment.apiUrl}/auth/login`, { email, token: idToken })
        .subscribe({
          next: (res) => {
            this.currentUser.set(res.user);
            localStorage.setItem('user_profile', JSON.stringify(res.user));
            resolve(res.user);
          },
          error: (err) => reject(err)
        });
    });
  }

  async register(email: string, password: string, displayName: string, role: 'customer' | 'admin' = 'customer'): Promise<any> {
    if (this.isFirebaseMock) {
      // Mock Client Register — send everything to server
      return new Promise((resolve, reject) => {
        this.http.post<{ user: User, token: string }>(`${environment.apiUrl}/auth/register`, {
          email,
          password,
          displayName,
          role
        }).subscribe({
          next: (res) => {
            this.currentUser.set(res.user);
            this.setToken(res.token);
            localStorage.setItem('user_profile', JSON.stringify(res.user));
            resolve(res.user);
          },
          error: (err) => reject(err.error || { message: 'Registration failed' })
        });
      });
    }

    // Real Firebase Register
    const credentials = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(credentials.user, { displayName });
    const idToken = await credentials.user.getIdToken();
    this.setToken(idToken);
    
    return new Promise((resolve, reject) => {
      this.http.post<{ user: User, token: string }>(`${environment.apiUrl}/auth/register`, {
        email,
        displayName,
        role,
        password
      }).subscribe({
        next: (res) => {
          this.currentUser.set(res.user);
          localStorage.setItem('user_profile', JSON.stringify(res.user));
          resolve(res.user);
        },
        error: (err) => reject(err)
      });
    });
  }

  async logout(): Promise<void> {
    if (!this.isFirebaseMock) {
      await signOut(this.auth);
    }
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
