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
      next: (data: any) => {
        if (data.length > 0 && data[0].productId && data[0].saleId) {
          this.sales = data.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice:
              typeof item.unitPrice === 'string'
                ? parseFloat(item.unitPrice)
                : item.unitPrice,
            subtotal:
              typeof item.subtotal === 'string'
                ? parseFloat(item.subtotal)
                : item.subtotal,
            saleId: item.saleId,
            userId: item.userId,
            sellerName: item.sellerName,
            saleDate: item.saleDate,
          }));
        } else {
          this.sales = data.map((s: any) => ({
            id: s.id,
            total: s.total,
            date: s.date,
            user:
              s.user ||
              (s.userId || s.userName
                ? { id: s.userId, name: s.userName, email: s.userEmail || null }
                : null),
            products: Array.isArray(s.saleDetails)
              ? s.saleDetails.map((d: any) => ({
                  id: d.productId,
                  name: d.productName,
                  quantity: d.quantity,
                  unitPrice: d.unitPrice,
                  subtotal: d.subtotal,
                }))
              : Array.isArray(s.products)
              ? s.products
              : [],
          }));
        }

        // reset paginación al recargar
        this.page = 1;
      },
      error: (err) => console.error('Failed to load sales', err),
    });
  }

  isProductList(): boolean {
    return (
      this.sales.length > 0 &&
      (!!this.sales[0].productId ||
        !!this.sales[0].productName ||
        !!this.sales[0].unitPrice)
    );
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
  products?: Array<{ id: number; quantity?: number }>;
}
