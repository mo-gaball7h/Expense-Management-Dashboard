import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
  isDarkMode = false;

  constructor(private router: Router, private confirmation: ConfirmationService) {}

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
      acceptLabel: 'Sign out',
      rejectLabel: 'Stay here',
      acceptIcon: 'pi pi-sign-out',
      rejectIcon: 'pi pi-arrow-left',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      defaultFocus: 'reject',
      closeOnEscape: true,
      dismissableMask: true,
      accept: () => {
        sessionStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isLoggedIn');
        this.router.navigate(['/login']);
      }
    });
  }
}
