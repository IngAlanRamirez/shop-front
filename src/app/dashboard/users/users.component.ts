import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface UserView {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string; // ISO or formatted
  salesCount: number;
}

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  // Mock data derived from backend entity shape (password intentionally excluded)
  users: UserView[] = [
    {
      id: 1,
      name: 'Admin Usuario',
      email: 'admin@example.com',
      role: 'admin',
      created_at: new Date().toISOString(),
      salesCount: 12,
    },
    {
      id: 2,
      name: 'Empleado Uno',
      email: 'empleado1@example.com',
      role: 'employee',
      created_at: new Date().toISOString(),
      salesCount: 4,
    },
  ];

  formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString();
  }

  /**
   * Retorna la clase CSS para el badge según el rol.
   */
  getRoleClass(role: string) {
    const r = (role || '').toLowerCase();
    switch (r) {
      case 'admin':
      case 'administrator':
        return 'role-admin';
      case 'employee':
      case 'staff':
        return 'role-employee';
      case 'client':
      case 'customer':
        return 'role-client';
      default:
        return 'role-default';
    }
  }

  formatRole(role: string) {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  }
}
