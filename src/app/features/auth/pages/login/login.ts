import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, ToastModule, RouterLink],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  recoveryForm: FormGroup;
  loading = false;
  showPassword = false;
  showForgotPassword = false;
  recoveryNotice = false;
  isDarkMode = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  openForgotPassword(): void {
    this.showForgotPassword = true;
    this.recoveryNotice = false;
  }

  backToLogin(): void {
    this.showForgotPassword = false;
    this.recoveryNotice = false;
    this.recoveryForm.reset();
  }

  onRecoverySubmit(): void {
    if (this.recoveryForm.invalid || this.loading) {
      this.recoveryForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService.requestPasswordRecovery(this.recoveryForm.controls['email'].value ?? '').pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: response => {
        this.recoveryNotice = true;
        this.messageService.add({ severity: 'info', summary: 'Recovery unavailable', detail: response.message });
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not process the recovery request.' })
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    this.loading = true;
    this.authService.signIn(username ?? '', password ?? '').pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        sessionStorage.setItem('isLoggedIn', 'true');
        this.messageService.add({ severity: 'success', summary: 'Welcome', detail: 'Logged in successfully.' });
        this.router.navigate(['/dashboard']);
      },
      error: error => this.messageService.add({
        severity: 'error',
        summary: 'Login failed',
        detail: error?.message || 'Invalid username or password.'
      })
    });
  }
}
