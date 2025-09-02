import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  products = [
    {
      name: 'Cherry Delight',
      sku: '#PDZ1240',
      price: '$20.00',
      stock: '250 pcs',
      type: 'Dessert',
      status: 'Bouncing',
    },
    {
      name: 'Kiwi',
      sku: '#FTL6553',
      price: '$12.00',
      stock: '550 kg',
      type: 'Fruits',
      status: 'Active',
    },
    {
      name: 'Mango Magic',
      sku: '#MGG5515',
      price: '$100.50',
      stock: '1200 pcs',
      type: 'Ice Cream',
      status: 'Inactive',
    },
    {
      name: 'Blueberry Bliss',
      sku: '#BLU2211',
      price: '$150.00',
      stock: '700 pcs',
      type: 'Cere',
      status: 'On Sale',
    },
    {
      name: 'Watermelon',
      sku: '#WTL4483',
      price: '$10.99',
      stock: '220 lb',
      type: 'Juice',
      status: 'Pending',
    },
  ];

  // filtros reactivos
  search = new FormControl('');
  filterType = new FormControl('all');
  filterStatus = new FormControl('all');

  // paginación
  page = 1;
  pageSize = 5;

  get filteredProducts() {
    const q = String(this.search.value || '')
      .toLowerCase()
      .trim();
    const type = this.filterType.value;
    const status = this.filterStatus.value;

    return this.products.filter((p) => {
      const matchesQ =
        q === '' ||
        [p.name, p.sku, p.price, p.type, p.status]
          .join(' ')
          .toLowerCase()
          .includes(q);
      const matchesType = type === 'all' || p.type === type;
      const matchesStatus = status === 'all' || p.status === status;
      return matchesQ && matchesType && matchesStatus;
    });
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  get pagedProducts() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
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
