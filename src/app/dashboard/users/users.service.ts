import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  http = inject(HttpClient);

  constructor() {}

  getUsers() {
    return this.http.get<any[]>('/users');
  }
}
