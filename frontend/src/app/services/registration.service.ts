import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  age?: number;
  city?: string;
  role?: string;
  active?: boolean;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly apiBaseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiBaseUrl}/register`, payload);
  }
}
