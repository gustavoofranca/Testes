import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

const firebaseConfig = {
  apiKey: "AIzaSyCj5JiGZNDf7cLNLl62R6d5J2G5B55M4mE",
  authDomain: "gustas-burguer.firebaseapp.com",
  projectId: "gustas-burguer",
  storageBucket: "gustas-burguer.firebasestorage.app",
  messagingSenderId: "420805439849",
  appId: "1:420805439849:web:59e4faab0fce2e98bdcdf8",
  measurementId: "G-P8PDRL1MPQ"
};

export interface UserRole {
  id: string;
  role: 'admin' | 'customer';
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth;
  private currentUser = new BehaviorSubject<User | null>(null);
  private userRoleSubject = new BehaviorSubject<UserRole | null>(null);

  user$ = this.currentUser.asObservable();
  userRole$ = this.userRoleSubject.asObservable();

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);

    // Set up auth state listener
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.next(user);
      if (user) {
        this.loadUserRole(user.uid);
      } else {
        this.userRoleSubject.next(null);
      }
    });
  }

  async signUp(email: string, password: string): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      // Criar registro de role do usuário (customer por padrão)
      await this.createUserRole(userCredential.user.uid, 'customer', email);
      return { data: userCredential.user, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async signIn(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return { data: userCredential.user, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async signOut(): Promise<any> {
    try {
      await signOut(this.auth);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  private async loadUserRole(userId: string) {
    // Implementação para carregar o papel do usuário
    // Por exemplo, usando o Firebase Firestore
    // const userRole = await this.firestore.collection('user_roles').doc(userId).get();
    // this.userRoleSubject.next(userRole.data());
  }

  private async createUserRole(userId: string, role: 'admin' | 'customer', email: string) {
    // Implementação para criar o papel do usuário
    // Por exemplo, usando o Firebase Firestore
    // await this.firestore.collection('user_roles').doc(userId).set({ id: userId, role, email });
  }

  getCurrentUser(): User | null {
    return this.currentUser.value;
  }

  isAdmin(): boolean {
    return this.userRoleSubject.value?.role === 'admin';
  }

  isCustomer(): boolean {
    return this.userRoleSubject.value?.role === 'customer';
  }
}