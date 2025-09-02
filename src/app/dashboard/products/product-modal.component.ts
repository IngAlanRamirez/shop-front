import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss'],
})
export class ProductModalComponent {
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  private fb = new FormBuilder();
  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    sku: ['', [Validators.required]],
    price: ['', [Validators.required]],
    stock: ['', [Validators.required]],
    type: [''],
    status: ['Active'],
  });

  onCancel() {
    this.cancel.emit();
  }

  onSubmit() {
    if (this.productForm.invalid) return;
    this.save.emit(this.productForm.value);
  }
}
