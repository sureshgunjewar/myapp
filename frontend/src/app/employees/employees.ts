import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService, Employee } from '../services/employee.service';

@Component({
  selector: 'app-employees',
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {
  employees: Employee[] = [];
  employeeForm: Partial<Employee> = {
    name: '',
    email: '',
    department: '',
    position: '',
  };
  editingId: number | null = null;
  isLoading = false;
  errorMessage = '';
  //test

  constructor(
    private employeeService: EmployeeService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadEmployees();
    }
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load employees from the backend.';
        this.isLoading = false;
      },
    });
  }

  submitEmployee(): void {
    if (!this.employeeForm.name || !this.employeeForm.email) {
      this.errorMessage = 'Name and email are required.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.editingId) {
      this.employeeService.updateEmployee(this.editingId, this.employeeForm).subscribe({
        next: () => {
          this.resetForm();
          this.loadEmployees();
        },
        error: () => {
          this.errorMessage = 'Unable to update employee.';
          this.isLoading = false;
        },
      });
      return;
    }

    this.employeeService.createEmployee(this.employeeForm).subscribe({
      next: () => {
        this.resetForm();
        this.loadEmployees();
      },
      error: () => {
        this.errorMessage = 'Unable to create employee.';
        this.isLoading = false;
      },
    });
  }

  editEmployee(employee: Employee): void {
    this.editingId = employee.id ?? null;
    this.employeeForm = { ...employee };
  }

  deleteEmployee(id?: number): void {
    if (!id) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.loadEmployees();
      },
      error: () => {
        this.errorMessage = 'Unable to delete employee.';
        this.isLoading = false;
      },
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.editingId = null;
    this.employeeForm = {
      name: '',
      email: '',
      department: '',
      position: '',
    };
    this.isLoading = false;
  }
}
