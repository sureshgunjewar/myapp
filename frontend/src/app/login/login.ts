import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegistrationService } from '../services/registration.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  isLoading = signal(false);
  errorMessage = '';
  emailError = '';
  passwordError = '';
  isRegistering = false;
  registerName = '';
  registerEmail = '';
  registerPassword = '';
  confirmPassword = '';
  registerError = '';
  registerSuccess = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private registrationService: RegistrationService,
  ) {}

  login(): void {
    this.errorMessage = '';
    this.emailError = '';
    this.passwordError = '';

    if (!this.email.trim()) {
      this.emailError = 'Email is required.';
    }

    if (!this.password.trim()) {
      this.passwordError = 'Password is required.';
    }

    if (this.emailError || this.passwordError) {
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: () => {
        this.errorMessage = 'Invalid email or password.';
        this.isLoading.set(false);
      },
    });
  }

  toggleRegister(): void {
    this.isRegistering = !this.isRegistering;
    this.registerError = '';
    this.registerSuccess = '';
  }

  register(): void {
    this.registerError = '';
    this.registerSuccess = '';

    if (!this.registerName.trim()) {
      this.registerError = 'Name is required.';
      return;
    }

    if (!this.registerEmail.trim()) {
      this.registerError = 'Email is required.';
      return;
    }

    if (!this.registerPassword) {
      this.registerError = 'Password is required.';
      return;
    }

    if (this.registerPassword !== this.confirmPassword) {
      this.registerError = 'Passwords do not match.';
      return;
    }

    this.isLoading.set(true);

    this.registrationService.register({
      name: this.registerName.trim(),
      email: this.registerEmail.trim(),
      password: this.registerPassword,
      password_confirmation: this.confirmPassword,
      active: true,
    }).subscribe({
      next: () => {
        this.registerSuccess = 'Registration successful. Please login.';
        this.isRegistering = false;
        this.registerName = '';
        this.registerEmail = '';
        this.registerPassword = '';
        this.confirmPassword = '';
        this.isLoading.set(false);
      },
      error: (err) => {
        this.registerError = err?.error?.errors?.join(', ') || 'Registration failed.';
        this.isLoading.set(false);
      },
    });
  }
}
