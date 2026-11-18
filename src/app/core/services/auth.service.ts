import { Injectable } from '@angular/core';
import { Observable, delay, map, of, throwError } from 'rxjs';

export interface PasswordRecoveryResponse {
  available: false;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly demoCredentials = { username: 'admin', password: '123456' };

  signIn(username: string, password: string): Observable<void> {
    return of(null).pipe(
      delay(450),
      map(() => {
        if (username !== this.demoCredentials.username || password !== this.demoCredentials.password) {
          throw new Error('Invalid username or password.');
        }
      })
    );
  }

  requestPasswordRecovery(_email: string): Observable<PasswordRecoveryResponse> {
    return of({
      available: false as const,
      message: 'Password recovery is unavailable because this demo has no email or backend service.'
    }).pipe(delay(350));
  }
}
