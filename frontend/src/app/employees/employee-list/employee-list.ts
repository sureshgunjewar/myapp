import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Employee, EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList implements OnInit {
  readonly employees = signal<Employee[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadEmployees();
    }
  }

  loadEmployees(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.employeeService.getEmployees().pipe(
      finalize(() => {
        this.isLoading.set(false);
      }),
    ).subscribe({
      next: (data) => {
        this.employees.set(data);
      },
      error: (error) => {
        this.employees.set([]);
        this.errorMessage.set(error?.status === 401
          ? 'Your session expired. Please login again.'
          : 'Unable to load employees from the backend.');
      },
    });
  }

  editEmployee(employee: Employee): void {
    if (employee.id) {
      this.router.navigate(['/employees', employee.id, 'edit']);
    }
  }

  deleteEmployee(id?: number): void {
    if (!id) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.employeeService.deleteEmployee(id).pipe(
      finalize(() => {
        this.isLoading.set(false);
      }),
    ).subscribe({
      next: () => {
        this.loadEmployees();
      },
      error: () => {
        this.errorMessage.set('Unable to delete employee.');
      },
    });
  }
}
