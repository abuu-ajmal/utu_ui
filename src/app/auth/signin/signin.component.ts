import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { HDividerComponent, } from '@elementar/components';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/authentication/auth.service';
import { GlobalConstants } from '@shared/global-constants';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatIconButton,
    MatSuffix,
    HDividerComponent,
    ReactiveFormsModule,
    MatError,
    MatTooltip

  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit {

  loginForm:any = FormGroup;
  passwordVisible: boolean = false;

  constructor(private formBuilder:FormBuilder,
    private route:Router,
    private authService:AuthService,){}

    ngOnInit(): void {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
      this.loginFormData();
    }

  public loginFormData(){
    this.loginForm = this.formBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  // Function to toggle password visibility
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  loginSubmit(){
    // this.matxLoader.open();
    this.authService.loginAuthenticate(this.loginForm.value).subscribe((response) => {
      // this.matxLoader.close();
        if (response && response.error) {
          console.log('Server returned an error:', response.error);
        } else {
          if(response.statusCode != 401 && response.data.statusCode == 200){
            localStorage.setItem("token", `Bearer ${response.data.token}`);
            if(response.data.login_status === '1'){
              this.authService.setPermissions(response.data.permissions);
              localStorage.setItem("user_id", response.data.user_id);
              localStorage.setItem("full_name", response.data.full_name);
              localStorage.setItem("email", response.data.email);
              localStorage.setItem("workingStationID", response.data.working_station_id);
              localStorage.setItem("workingStationName", response.data.working_station_name);
              // localStorage.setItem("roles", response.data.roles.name);
              localStorage.setItem("roles", response.data.roles[0]?.name || 'Default Role');

              localStorage.setItem("isLogin","true");
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "Login Successifully"
              });
              this.route.navigateByUrl("pages")
            }
            else{
              console.log('change password')
              // const Toast = Swal.mixin({
              //   toast: true,
              //   position: "top-end",
              //   showConfirmButton: false,
              //   timer: 3000,
              //   timerProgressBar: true,
              //   didOpen: (toast) => {
              //     toast.onmouseenter = Swal.stopTimer;
              //     toast.onmouseleave = Swal.resumeTimer;
              //   }
              // });
              // Toast.fire({
              //   icon: "warning",
              //   title: "Please change the password first"
              // });
              // this.route.navigateByUrl("auth/authfirst")
            }

          }else{
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "error",
              title: response.message
            });
            this.route.navigateByUrl("/")
          }
        }
      },(error) => {
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
