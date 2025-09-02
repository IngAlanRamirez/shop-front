import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from './users.service';

interface UserView {
  id: number;
  name: string;
  email: string;
  role: string;
  salesCount: number;
}

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  usersService = inject(UsersService);
  users: UserView[] = [];

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

  ngOnInit() {
    this.usersService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }
}
