import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from './sales.component';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  http = inject(HttpClient);

  constructor() {}

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>('/sales/products-sold');
  }

  addSale(saleData: any) {
    return this.http.post('/sales', saleData);
  }
}
