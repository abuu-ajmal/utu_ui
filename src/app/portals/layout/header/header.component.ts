import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/authentication/auth.service';
import { GlobalConstants } from '@shared/global-constants';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-portal-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
     ReactiveFormsModule,
     MatIcon
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
      login: new FormControl(null, [
        Validators.required,

      ]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  togglePasswordVisibility() {
  this.passwordVisible = !this.passwordVisible;
}

closeModal() {
  this.isModalOpen = false;
}



  // ✅ Open/close modal
  openModal() {
    this.isModalOpen = true;
  }


  // ✅ Submit login
loginSubmit() {
  if (this.loginForm.invalid) return;

  this.authService.loginAuthenticate(this.loginForm.value).subscribe(
    (response: any) => {
      // 🟡 First login (must change password)
      if (response.data?.login_status === false && response.data?.first_login === true) {
        localStorage.setItem('temp_token', `Bearer ${response.data.token}`);
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('full_name', response.data.full_name);
        localStorage.setItem('email', response.data.email);

        Swal.fire({
          icon: 'warning',
          title: 'First Login Detected',
          text: 'You must change your password before continuing.',
          showCancelButton: true,
          confirmButtonText: 'Change Password',
          cancelButtonText: 'Cancel',
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.closeModal();
            this.route.navigateByUrl('home/change-password');
          } else {
            Swal.close();
          }
        });

        return;
      }

      // 🟢 Normal successful login
      if (response.data?.login_status === true && response.data?.statusCode === 200) {
        localStorage.setItem('token', `Bearer ${response.data.token}`);
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('roles', response.data.roles?.[0]?.name || 'Default Role');

        this.authService.setPermissions(response.data.permissions);

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          timer: 1500,
          showConfirmButton: false,
        });

        this.route.navigateByUrl('pages');
        return;
      }

      // 🔴 Invalid username or password
      if (
        response.statusCode === 401 ||
        response.data?.statusCode === 401 ||
        (response.data?.message &&
          response.data.message.toLowerCase().includes('invalid'))
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Credentials',
          text: 'Incorrect username or password. Please try again.',
        });
        return;
      }

      // ⚠️ Other backend errors
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: response.data?.message || 'Something went wrong. Please try again.',
      });
    },
    (error) => {
      // 🔴 API or server error
      if (error.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Credentials',
          text: 'Incorrect username or password.',
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Connection Error',
          text: 'Failed to connect to server.',
        });
      }
    }
  );
}





 getHome() {
    // ✅ Use relative path so it stays inside layout
    this.route.navigate(['home']);
  }

}
