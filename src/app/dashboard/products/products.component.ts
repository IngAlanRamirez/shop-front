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

  products: Array<{
    name: string;
    sku: string;
    price: number;
    type: string;
    status: string;
  }> = [];

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
        this.products = data;
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
    // Call API to create product and update table on success
    const svc: any = this.dashboardService as any;
    if (svc.createProduct) {
      svc.createProduct(newProd).subscribe({
        next: (created: any) => {
          const toAdd =
            created && typeof created === 'object' ? created : newProd;
          this.products = [toAdd, ...this.products];
          this.showAddModal = false;
        },
        error: (err: any) => {
          console.error('create failed', err);
        },
      });
    } else {
      this.products = [newProd, ...this.products];
      this.showAddModal = false;
    }
  }
}
