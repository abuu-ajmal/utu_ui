import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/authentication/auth.service';
import { GlobalConstants } from '@shared/global-constants';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, MatButtonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {

  showOldPassword = false;
showNewPassword = false;
showConfirmPassword = false;

  changePasswordForm!: FormGroup;
  token!: string | null;
  loading: boolean = false; // <-- add this

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('temp_token');
    if (!this.token) {
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Please log in again.',
      });
      this.router.navigateByUrl('/');
      return;
    }

    this.changePasswordForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(7)]],
      new_password_confirmation: ['', Validators.required]
    });
  }
  togglePasswordVisibility(field: string): void {
  if (field === 'old') this.showOldPassword = !this.showOldPassword;
  else if (field === 'new') this.showNewPassword = !this.showNewPassword;
  else if (field === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
}

onSubmit(): void {
  if (this.changePasswordForm.invalid) return;

  const { old_password, new_password, new_password_confirmation } = this.changePasswordForm.value;

  // ✅ Check if new passwords match before sending to backend
  if (new_password !== new_password_confirmation) {
    Swal.fire({
      icon: 'error',
      title: 'Passwords do not match',
      text: 'New password and confirmation must be the same.',
    });
    return;
  }

  this.loading = true;

  const body = { old_password, new_password, new_password_confirmation };

  this.authService.changePassword(body, this.token!).subscribe({
    next: (res) => {
      this.loading = false;

      // ✅ Success
      if (res.statusCode === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Password changed successfully!',
          text: 'Please log in with your new password.',
          timer: 2500,
          showConfirmButton: false,
        }).then(() => {
          localStorage.removeItem('temp_token');
          localStorage.removeItem('isLogin');
          localStorage.removeItem('token');
          this.router.navigateByUrl('home/user-login');
        });
      }

      // ❌ Backend validation error (422)
      else if (res.statusCode === 422 && res.errors) {
        const errorMessages = Object.values(res.errors).flat().join('\n');
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: errorMessages || 'Please check your inputs.',
        });
      }

      // ❌ Incorrect old password or other auth issue
      else if (res.statusCode === 401 || res.message?.toLowerCase().includes('old password')) {
        Swal.fire({
          icon: 'error',
          title: 'Incorrect Old Password',
          text: 'The old password you entered is incorrect. Please try again.',
        });
      }

      // ❌ Other errors
      else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to change password',
          text: res.message || 'Something went wrong. Please try again.',
        });
      }
    },
    error: (err) => {
      this.loading = false;

      // ✅ Handle API-level validation errors (422)
      if (err.status === 422 && err.error?.errors) {
        const errorMessages = Object.values(err.error.errors).flat().join('\n');
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: errorMessages,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Failed to connect to the server.',
        });
      }
    },
  });
}


}
