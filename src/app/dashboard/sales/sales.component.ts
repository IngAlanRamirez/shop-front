import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="child-page">
      <h2>Ordenes / Ventas</h2>
      <p>Componente de órdenes/ventas.</p>
    </div>
  `,
})
export class SalesComponent {}
