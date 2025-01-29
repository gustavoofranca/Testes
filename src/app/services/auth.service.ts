import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

export interface UserRole {
  id: string;
  role: 'admin' | 'customer';
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private userSubject = new BehaviorSubject<User | null>(null);
  private userRoleSubject = new BehaviorSubject<UserRole | null>(null);

  user$ = this.userSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();

  constructor() {
    this.supabase = createClient(
      process.env['SUPABASE_URL'] || '',
      process.env['SUPABASE_KEY'] || ''
    );

    // Verificar sessão atual
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.userSubject.next(session?.user || null);
      if (session?.user) {
        this.loadUserRole(session.user.id);
      }
    });

    // Monitorar mudanças de autenticação
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.userSubject.next(session?.user || null);
      if (session?.user) {
        this.loadUserRole(session.user.id);
      } else {
        this.userRoleSubject.next(null);
      }
    });
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    // Criar registro de role do usuário (customer por padrão)
    if (data.user) {
      await this.supabase
        .from('user_roles')
        .insert({
          id: data.user.id,
          role: 'customer',
          email: data.user.email
        });
    }

    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  private async loadUserRole(userId: string) {
    const { data, error } = await this.supabase
      .from('user_roles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    this.userRoleSubject.next(data);
  }

  isAdmin(): boolean {
    return this.userRoleSubject.value?.role === 'admin';
  }

  isCustomer(): boolean {
    return this.userRoleSubject.value?.role === 'customer';
  }
}