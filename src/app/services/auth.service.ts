import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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
  user$ = this.auth.user;
  
  isAdmin$ = this.user$.pipe(
    map(user => user?.email === 'admin@example.com')
  );

  constructor(private auth: AngularFireAuth) {}

  async login(email: string, password: string): Promise<void> {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
}
