import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../core/services/auth.service';
import { PermissionService } from '../../core/services/permission.service';
import { Role } from '../../core/models/auth.model';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout implements OnInit {
  menuOpen = false;
  userMenuOpen = false;
  accessMenuOpen = false;
  isDarkMode = false;

  constructor(
    private router: Router,
    private confirmation: ConfirmationService,
    private auth: AuthService,
    public permissions: PermissionService
  ) {}

  get currentUser() { return this.auth.currentUser; }

  get avatarInitials(): string {
    return (this.currentUser?.name ?? 'User').split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase();
  }

  get roleLabel(): string {
    const labels: Record<Role, string> = {
      admin: 'Administrator', manager: 'Finance Manager', accountant: 'Accountant', viewer: 'Read-only Viewer'
    };
    return this.currentUser ? labels[this.currentUser.role] : 'Guest';
  }

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
  }
  closeMenu(): void { 
    this.menuOpen = false; 
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  private applyTheme(): void {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }
  logout(): void {
    this.userMenuOpen = false;
    this.confirmation.confirm({
      header: 'Sign out?',
      message: 'Are you sure you want to sign out of Spendwise?',
      icon: 'pi pi-sign-out',
      acceptLabel: 'Logout',
      rejectLabel: 'Cancel',
      acceptIcon: 'pi pi-sign-out',
      rejectIcon: '',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      defaultFocus: 'reject',
      closeOnEscape: false,
      dismissableMask: false,
      accept: () => {
        this.auth.signOut();
        this.router.navigate(['/login']);
      }
    });
  }
}
