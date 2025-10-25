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
  // this.matxLoader.open();
  this.authService.loginAuthenticate(this.loginForm.value).subscribe(
    (response) => {
      // this.matxLoader.close();



      // Handle valid response
      const data = response.data;
      alert(data.statusCode);
      console.log(data);
      // if (data.statusCode === 200) {
      //   // Save token
      //   localStorage.setItem('token', `Bearer ${data.token}`);

      //   // ✅ CASE 1: Normal login (already changed password)
      //   if (data.login_status === true) {
      //     this.authService.setPermissions(data.permissions);
      //     localStorage.setItem('user_id', data.user_id);
      //     localStorage.setItem('full_name', data.full_name);
      //     localStorage.setItem('email', data.email);
      //     localStorage.setItem('roles', data.roles?.[0]?.name || 'Default Role');
      //     localStorage.setItem('isLogin', 'true');

      //     // Success message
      //     Swal.fire({
      //       toast: true,
      //       position: 'top-end',
      //       icon: 'success',
      //       title: 'Login Successfully',
      //       showConfirmButton: false,
      //       timer: 3000,
      //       timerProgressBar: true,
      //     });

      //     this.route.navigateByUrl('pages');
      //   }
      // }
      // // ✅ CASE 2: First-time login → must change password
      // else if (data.login_status === false) {
      //   // Save token temporarily for password change
      //   localStorage.setItem('temp_token', `Bearer ${data.token}`);
      //   localStorage.setItem('user_id', data.user_id);

      //   Swal.fire({
      //     toast: true,
      //     position: 'top-end',
      //     icon: 'warning',
      //     title: 'Please change your password first',
      //     showConfirmButton: false,
      //     timer: 4000,
      //     timerProgressBar: true,
      //   });

      //   // Redirect to change password page
      //   this.route.navigateByUrl('home/change-password');
      // }
    }

    // (error) => {
    //   Swal.fire({
    //     title: 'Warning!',
    //     text: 'Connection failed. Please try again later.',
    //     icon: 'warning',
    //     confirmButtonText: 'OK',
    //   });
    // }
  );
}



 getHome() {
    // ✅ Use relative path so it stays inside layout
    this.route.navigate(['home']);
  }

}
