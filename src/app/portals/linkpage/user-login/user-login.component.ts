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
  if (this.loginForm.invalid) {
    Swal.fire({
      icon: 'error',
      title: 'Validation Failed',
      text: 'Please enter valid credentials',
    });
    return;
  }

  this.loading = true;

  this.authService.loginAuthenticate(this.loginForm.value).subscribe(
    (response: any) => {
      this.loading = false;

      if (response && response.error) {
        console.error('Server returned an error:', response.error);
      } else {
        if (response.statusCode !== 401 && response.data.statusCode === 200) {
          // Save login info
          localStorage.setItem('token', `Bearer ${response.data.token}`);
          localStorage.setItem('isLogin', 'true');
          localStorage.setItem('user_id', response.data.user_id);
          localStorage.setItem('full_name', response.data.full_name);
          localStorage.setItem('login', response.data.login);
          localStorage.setItem('roles', response.data.roles[0]?.name || 'Default Role');
          localStorage.setItem('workingStationID', response.data.working_station_id);
          localStorage.setItem('workingStationName', response.data.working_station_name);

          this.authService.setPermissions(response.data.permissions);

          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });

          // Check login_status
          if (response.data.login_status === true) {
            Toast.fire({
              icon: 'success',
              title: 'Login Successfully',
            });

            // Close login modal
            this.isModalOpen = false;

            // Navigate to dashboard/home
            this.route.navigateByUrl('pages');
          } else {
            // Remove login modal and navigate to change-password
            this.isModalOpen = false;

            Toast.fire({
              icon: 'warning',
              title: 'Please change your password first',
            });

            this.route.navigateByUrl('home/change-password');
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: response.message,
          });
          this.isModalOpen = false;
          this.route.navigateByUrl('/');
        }
      }
    },
    (error) => {
      this.loading = false;
      Swal.fire({
        title: 'Warning!',
        text: GlobalConstants.genericErrorConnectFail,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
  );
}


 getHome() {
    // ✅ Use relative path so it stays inside layout
    this.route.navigate(['home']);
  }

}
