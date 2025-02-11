import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface UserRole {
  id: string;
  role: 'admin' | 'customer';
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  
  isAdmin$ = this.user$.pipe(
    map(user => user?.email === environment.testCredentials.email)
  );

  constructor(private auth: AngularFireAuth) {
    // Verificar se já existe um usuário logado no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      // Para desenvolvimento, aceitar as credenciais de teste
      if (email === environment.testCredentials.email && 
          password === environment.testCredentials.password) {
        const mockUser = {
          email: environment.testCredentials.email,
          role: 'admin'
        };
        this.userSubject.next(mockUser);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        return;
      }

      // Se não for as credenciais de teste, tentar autenticação no Firebase
      const result = await this.auth.signInWithEmailAndPassword(email, password);
      if (result.user) {
        const user = {
          email: result.user.email,
          role: 'customer'
        };
        this.userSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      this.userSubject.next(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }
}
