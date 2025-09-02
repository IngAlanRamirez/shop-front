import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { SalesService } from './sales.service';
import { SaleModalComponent } from './sale-modal.component';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SaleModalComponent],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent {
  salesService = inject(SalesService);

  // sales puede ser un array de ventas o un array de productos (según endpoint)
  sales: any[] = [];
  // filtros
  search = new FormControl('');

  // paginación
  page = 1;
  pageSize = 8;

  ngOnInit(): void {
    this.loadSales();
  }

  openSaleModal(ref: any) {
    ref.open();
  }

  loadSales() {
    this.salesService.getSales().subscribe({
      next: (data: any[]) => (this.sales = data || []),
      error: (err) => console.error('Failed to load sales', err),
    });
  }

  // Detecta si la lista contiene objetos de producto (tienen 'name' y 'sku')
  isProductList(): boolean {
    return this.sales.length > 0 && !!this.sales[0].name && !!this.sales[0].sku;
  }

  get filteredSales() {
    const q = String(this.search.value || '')
      .toLowerCase()
      .trim();
    return this.sales.filter((s) => {
      const user = (s.user && (s.user.name || s.user.email)) || '';
      const joined = [s.id, user, s.total, s.date].join(' ').toLowerCase();
      return q === '' || joined.includes(q);
    });
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.filteredSales.length / this.pageSize));
  }

  get pagedSales() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredSales.slice(start, start + this.pageSize);
  }

  setPage(n: number) {
    if (n < 1) n = 1;
    if (n > this.totalPages) n = this.totalPages;
    this.page = n;
  }

  prev() {
    this.setPage(this.page - 1);
  }

  next() {
    this.setPage(this.page + 1);
  }
}

export interface Sale {
  id: number;
  total: number;
  date: string;
  user: { id?: number; name?: string; email?: string } | null;
  // products or counts may vary depending on backend
  products?: Array<{ id: number; quantity?: number }>;
}
