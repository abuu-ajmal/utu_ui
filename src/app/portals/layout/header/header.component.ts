import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/authentication/auth.service';
import { GlobalConstants } from '@shared/global-constants';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-portal-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
     ReactiveFormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
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
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(GlobalConstants.emailRegex),
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

  this.authService.loginAuthenticate(this.loginForm.value).subscribe(
    (response) => {
      if (response && response.error) {
        console.log('Server returned an error:', response.error);
      } else {
        if (response.statusCode != 401 && response.data.statusCode == 200) {
          // Save token and login info
          localStorage.setItem('token', `Bearer ${response.data.token}`);
          localStorage.setItem('isLogin', 'true');
          localStorage.setItem('user_id', response.data.user_id);
          localStorage.setItem('full_name', response.data.full_name);
          localStorage.setItem('email', response.data.email);
          localStorage.setItem('roles', response.data.roles[0]?.name || 'Default Role');
          localStorage.setItem('workingStationID', response.data.working_station_id);
          localStorage.setItem('workingStationName', response.data.working_station_name);

          // Save permissions in the service
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

          // Check login status
          if (response.data.login_status === true) {
            Toast.fire({
              icon: 'success',
              title: 'Login Successfully',
            });

            this.closeModal();
            this.route.navigateByUrl('pages');
            // Optionally start inactivity watcher here
            // this.inactivityService.startWatching();
          } else {
            Toast.fire({
              icon: 'warning',
              title: 'Please change the password first',
            });
            this.route.navigateByUrl('auth/set-new-password');
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: response.message,
          });
          this.route.navigateByUrl('/');
        }
      }
    },
    (error) => {
      Swal.fire({
        title: 'Warning!',
        text: GlobalConstants.genericErrorConnectFail,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
  );
}

}
