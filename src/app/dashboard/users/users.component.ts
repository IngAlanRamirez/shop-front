import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="child-page">
      <h2>Usuarios</h2>
      <p>Componente de usuarios.</p>
    </div>
  `,
})
export class UsersComponent {}
