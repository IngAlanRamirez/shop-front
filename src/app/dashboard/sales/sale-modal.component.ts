import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SalesService } from './sales.service';

@Component({
  selector: 'app-sale-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sale-modal.component.html',
  styleUrls: ['./sale-modal.component.scss'],
})
export class SaleModalComponent {
  @Output() saved = new EventEmitter<void>();

  fb = inject(FormBuilder);
  salesService = inject(SalesService);

  form = this.fb.group({
    userId: [null, [Validators.required]],
    date: [null, [Validators.required]],
    productsJson: ['', [Validators.required]],
  });

  visible = false;

  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

  submit() {
    if (this.form.invalid) return;
    let payload: any;
    try {
      payload = JSON.parse(this.form.value.productsJson || '[]');
    } catch (e) {
      alert('Productos inválidos: debe ser un JSON de array');
      return;
    }

    this.salesService
      .addSale({
        userId: this.form.value.userId,
        date: this.form.value.date,
        products: payload,
      })
      .subscribe({
        next: () => {
          this.saved.emit();
          this.close();
        },
        error: (err) => alert('Error creando venta: ' + err?.message || err),
      });
  }
}
