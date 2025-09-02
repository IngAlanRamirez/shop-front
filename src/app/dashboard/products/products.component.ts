import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { DashboardService } from '../dashboard.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductModalComponent } from './product-modal.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductModalComponent],
  styleUrls: ['./products.component.scss'],
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  dashboardService = inject(DashboardService);
  fb = inject(FormBuilder);
  // modal is now a child component
  showAddModal = false;

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

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.dashboardService.getAllProducts().subscribe({
      next: (data: any[]) => {
        console.log('loaded products', data);
        // this.products = data;
      },
      error: (err) => console.error('Failed to load products', err),
    });
  }

  openAddModal() {
    this.showAddModal = true;
  }
  onModalCancel() {
    this.showAddModal = false;
  }

  onModalSave(newProd: any) {
    // optimistically add to list
    this.products = [newProd, ...this.products];
    // optionally call API if implemented
    const svc: any = this.dashboardService as any;
    if (svc.createProduct) {
      svc.createProduct(newProd).subscribe({
        next: () => console.log('product created'),
        error: (err: any) => console.error('create failed', err),
      });
    }
    this.showAddModal = false;
  }
}
