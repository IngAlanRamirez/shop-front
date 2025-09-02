import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  http = inject(HttpClient);
  constructor() {}

  login(email: string, password: string) {
    return this.http.post('/auth/login', { email, password });
  }
}
