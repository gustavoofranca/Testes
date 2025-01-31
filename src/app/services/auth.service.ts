import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = user(this.auth);
  
  isAdmin$ = this.user$.pipe(
    map(user => user?.email === 'admin@example.com')
  );

  constructor(private auth: Auth) {}

  getCurrentUser() {
    return this.auth.currentUser;
  }

  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }
}
