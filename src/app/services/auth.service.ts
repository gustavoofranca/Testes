import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Observable, map } from 'rxjs';

export interface UserRole {
  id: string;
  role: 'admin' | 'customer';
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = user(this.auth);
  
  isAdmin$ = this.user$.pipe(
    map(user => user?.email === 'admin@example.com')
  );

  constructor(private auth: Auth) {}

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
}
