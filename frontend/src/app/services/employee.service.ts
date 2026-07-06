import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Employee {
  id?: number;
  name: string;
  email: string;
  department: string;
  position: string;
  created_at?: string;
  updated_at?: string;
}

type EmployeesResponse = Employee[] | { employees?: Employee[]; data?: Employee[] };

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly apiUrl = '/api/v1/employees';
  private readonly readHeaders = new HttpHeaders({
    Accept: 'application/json',
  });
  private readonly writeHeaders = new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<EmployeesResponse>(this.apiUrl, { headers: this.readHeaders }).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response;
        }

        return response.employees ?? response.data ?? [];
      }),
    );
  }

  createEmployee(employee: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, { employee }, { headers: this.writeHeaders });
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/${id}`, { employee }, { headers: this.writeHeaders });
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.readHeaders });
  }
}
