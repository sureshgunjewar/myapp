import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Employee, EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeForm implements OnInit {
  employeeForm: Partial<Employee> = {
    name: '',
    email: '',
    department: '',
    position: '',
  };
  editingId: number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.editingId = Number(id);
        this.loadEmployee(this.editingId);
      }
    }
  }

  loadEmployee(id: number): void {
    this.isLoading = true;
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        const employee = employees.find((item) => item.id === id);
        if (employee) {
          this.employeeForm = { ...employee };
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load employee details.';
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
          this.router.navigate(['/employees']);
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
        this.router.navigate(['/employees']);
      },
      error: () => {
        this.errorMessage = 'Unable to create employee.';
        this.isLoading = false;
      },
    });
  }
}
