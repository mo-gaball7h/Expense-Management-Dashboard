import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, of } from 'rxjs';
import { AuthenticatedUser, ManagedUser, Role } from '../models/auth.model';
import { DEMO_ACCOUNTS } from '../data/demo-accounts';

export interface PasswordRecoveryResponse {
  available: false;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionKey = 'spendwise.currentUser';
  private readonly userSubject = new BehaviorSubject<AuthenticatedUser | null>(this.readUser());
  readonly currentUser$ = this.userSubject.asObservable();

  get currentUser(): AuthenticatedUser | null {
    return this.userSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  signIn(username: string, password: string): Observable<AuthenticatedUser> {
    return of(null).pipe(
      delay(450),
      map(() => {
        const account = DEMO_ACCOUNTS.find(user => user.username === username && user.password === password);
        if (!account) throw new Error('Invalid username or password.');

        const { password: _password, department: _department, lastActive: _lastActive, ...user } = account;
        this.userSubject.next(user);
        this.writeUser(user);
        return user;
      })
    );
  }

  getDemoUsers(): Observable<ManagedUser[]> {
    const users = DEMO_ACCOUNTS.map(({ password: _password, ...user }) => ({ ...user }));
    return of(users);
  }

  signOut(): void {
    this.userSubject.next(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.sessionKey);
      sessionStorage.removeItem('isLoggedIn');
      localStorage.removeItem('isLoggedIn');
    }
  }

  requestPasswordRecovery(_email: string): Observable<PasswordRecoveryResponse> {
    return of({
      available: false as const,
      message: 'Password recovery is unavailable because this demo has no email or backend service.'
    }).pipe(delay(350));
  }

  private readUser(): AuthenticatedUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem(this.sessionKey);
      if (!raw) return null;
      const user = JSON.parse(raw) as AuthenticatedUser;
      const validRoles: Role[] = ['admin', 'manager', 'accountant', 'viewer'];
      return user && validRoles.includes(user.role) ? user : null;
    } catch {
      return null;
    }
  }

  private writeUser(user: AuthenticatedUser): void {
    if (typeof window !== 'undefined') sessionStorage.setItem(this.sessionKey, JSON.stringify(user));
  }
}
