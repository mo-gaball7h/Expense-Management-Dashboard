import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { PERMISSION_CATALOG, PermissionService, RoleInfo } from '../../../../core/services/permission.service';
import { ManagedUser, Permission } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-roles-permissions-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles-permissions-page.html',
  styleUrl: './roles-permissions-page.scss'
})
export class RolesPermissionsPage implements OnInit {
  readonly roles: RoleInfo[];
  readonly permissionGroups = [...new Set(PERMISSION_CATALOG.map(item => item.group))].map(group => ({
    name: group,
    permissions: PERMISSION_CATALOG.filter(item => item.group === group)
  }));
  users: ManagedUser[] = [];

  constructor(private permissions: PermissionService, private auth: AuthService) {
    this.roles = this.permissions.getRoles();
  }

  ngOnInit(): void {
    this.auth.getDemoUsers().subscribe(users => this.users = users);
  }

  roleHas(role: RoleInfo, permission: Permission): boolean {
    return role.permissions.includes(permission);
  }

  usersInRole(role: RoleInfo): number {
    return this.users.filter(user => user.role === role.key).length;
  }
}
