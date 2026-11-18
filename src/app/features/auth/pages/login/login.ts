import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, ToastModule, RouterLink],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  recoveryForm: FormGroup;
  loading: boolean = false;
  showPassword = false;
  showForgotPassword = false;
  recoveryNotice = false;
  isDarkMode = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
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
    if (this.recoveryForm.invalid) {
      this.recoveryForm.markAllAsTouched();
      return;
    }

    this.recoveryNotice = true;
    this.messageService.add({
      severity: 'info',
      summary: 'Demo mode',
      detail: 'Password recovery is not connected to an email service yet.'
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    // هنا تقدر تحط البيانات اللي تعجبك بمزاجك
    if (username === 'admin' && password === '123456') {
      this.loading = true;

      sessionStorage.setItem('isLoggedIn', 'true');
      
      setTimeout(() => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Welcome',
          detail: 'Logged in successfully.'
        });

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 800);
      }, 1000);
    } else {
      // لو اليوزر أو الباسورد غلط
      this.messageService.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: 'Invalid username or password.'
      });
    }
  }
}
