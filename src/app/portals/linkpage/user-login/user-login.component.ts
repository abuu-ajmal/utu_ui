import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/authentication/auth.service';
import { GlobalConstants } from '@shared/global-constants';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss'
})
export class UserLoginComponent {
  loginForm!: FormGroup;
  loading = false;
  passwordVisible = false;
  isModalOpen = false; // control modal visibility

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private authService: AuthService,


  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    this.loginFormData();
  }

  public loginFormData() {
    this.loginForm = this.formBuilder.group({
      login: new FormControl(null, [
        Validators.required,

      ]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  // ✅ Toggle password visibility
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  // ✅ Open/close modal
  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }

  // ✅ Submit login
loginSubmit() {
  if (this.loginForm.invalid) return;

  this.authService.loginAuthenticate(this.loginForm.value).subscribe(
    (response: any) => {
      // First-login detected
      if (response.data?.login_status === false && response.data?.first_login === true) {
        // Save temporary token
        localStorage.setItem('temp_token', `Bearer ${response.data.token}`);
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('full_name', response.data.full_name);
        localStorage.setItem('email', response.data.email);

        Swal.fire({
          icon: 'warning',
          title: 'First Login Detected',
          text: 'Please change your password first',
        });

        // Redirect to change-password page
        this.route.navigateByUrl('home/change-password');
        return;
      }

      // Normal successful login
      if (response.data?.login_status === true && response.data.statusCode === 200) {
        localStorage.setItem('token', `Bearer ${response.data.token}`);
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('roles', response.data.roles[0]?.name || 'Default Role');

        this.authService.setPermissions(response.data.permissions);

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
        });

        this.route.navigateByUrl('pages');
      }

      // Other errors
      if (response.data?.statusCode === 401 || response.statusCode === 403) {
        Swal.fire({
          icon: 'error',
          title: response.data?.message || 'Login failed',
        });
      }
    },
    (error) => {
      Swal.fire({
        icon: 'warning',
        title: 'Connection Error',
        text: 'Failed to connect to server.',
      });
    }
  );
}


 getHome() {
    // ✅ Use relative path so it stays inside layout
    this.route.navigate(['home']);
  }

}
