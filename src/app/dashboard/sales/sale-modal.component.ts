import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
} from '@angular/forms';
import { SalesService } from './sales.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-sale-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sale-modal.component.html',
  styleUrls: ['./sale-modal.component.scss'],
})
export class SaleModalComponent {
  salesService = inject(SalesService);
  dashboardService = inject(DashboardService);

  @Output() saved = new EventEmitter<void>();

  fb = inject(FormBuilder);

  form = this.fb.group({
    userId: [null, [Validators.required]],
    date: [null, [Validators.required]],
    products: this.fb.array([]),
  });

  productsList: Array<any> = [];

  visible = false;

  open() {
    this.visible = true;
    // ensure at least one item to start
    if (this.items.length === 0) this.addItem();
  }

  close() {
    this.visible = false;
    // clear products form array
    while (this.items.length) {
      this.items.removeAt(0);
    }
    // reset other controls and state
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  submit() {
    if (this.form.invalid) return;

    const controls = this.items.controls as FormGroup[];
    const productsPayload = controls
      .map((g) => g.value)
      .filter((p: any) => p.productId != null && p.quantity > 0)
      .map((p: any) => ({
        productId: Number(p.productId),
        quantity: Number(p.quantity),
      }));

    if (productsPayload.length === 0) {
      alert('Debe agregar al menos un producto con cantidad mayor a 0');
      return;
    }

    this.salesService
      .addSale({
        userId: this.form.value.userId,
        date: this.form.value.date,
        products: productsPayload,
      })
      .subscribe({
        next: () => {
          this.saved.emit();
          this.close();
        },
        error: (err) => alert('Error creando venta: ' + (err?.message || err)),
      });
  }

  // helpers for form array
  get items(): FormArray {
    return this.form.get('products') as FormArray;
  }

  addItem() {
    this.items.push(
      this.fb.group({
        productId: [null, [Validators.required]],
        quantity: [1, [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeItem(i: number) {
    this.items.removeAt(i);
  }

  // load products for select
  ngOnInit(): void {
    this.dashboardService.getAllProducts().subscribe({
      next: (data: any[]) => (this.productsList = data || []),
      error: (err) =>
        console.error('Failed to load products for sale modal', err),
    });
  }
}
