import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ManagedUser, Role } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss'
})
export class UsersPage implements OnInit, OnDestroy {
  users: ManagedUser[] = [];
  search = '';
  selectedRole: Role | '' = '';
  loading = true;
  loadError = '';
  private subscription?: Subscription;

  readonly roleLabels: Record<Role, string> = {
    admin: 'Administrator', manager: 'Finance Manager', accountant: 'Accountant', viewer: 'Read-only Viewer'
  };

  constructor(private auth: AuthService) {}

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.subscription?.unsubscribe();
    this.loading = true;
    this.loadError = '';
    this.subscription = this.auth.getDemoUsers().subscribe({
      next: users => { this.users = users; this.loading = false; },
      error: () => { this.loadError = 'Could not load the user directory. Please try again.'; this.loading = false; }
    });
  }

  ngOnDestroy(): void { this.subscription?.unsubscribe(); }

  get filteredUsers(): ManagedUser[] {
    const term = this.search.trim().toLowerCase();
    return this.users.filter(user =>
      (!term || `${user.name} ${user.username} ${user.email} ${user.department}`.toLowerCase().includes(term)) &&
      (!this.selectedRole || user.role === this.selectedRole)
    );
  }

  get roleCount(): number { return new Set(this.users.map(user => user.role)).size; }

  get currentUserId(): string | null { return this.auth.currentUser?.id ?? null; }

  initials(name: string): string {
    return name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase();
  }
}
