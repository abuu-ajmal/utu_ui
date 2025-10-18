import { Component } from '@angular/core';
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
export class ChangePasswordComponent {
  loading:false;

  credentialForm:any = FormGroup;
  passwordVisible: boolean = false;
  newPasswordVisible: boolean = false;
  passwordConfirmVisible: boolean = false;
  passwordConfirmed: boolean = false;

  constructor(private formBuilder:FormBuilder,
    private route:Router,
    private authService:AuthService,){}

    ngOnInit(): void {
      this.credentialFormData();
    }

  public credentialFormData(){
    this.credentialForm = this.formBuilder.group({
      old_password: new FormControl(null, [Validators.required]),
      new_password: new FormControl(null, [Validators.required]),
      new_password_confirmation: new FormControl(null, [Validators.required]),
    },{
      validators: this.checkPassword('new_password', 'new_password_confirmation') // Apply the custom validator
    });
  }

  // Function to toggle password visibility
  togglePasswordVisibility(visibility: any): void {
    if(visibility == 'new'){
      this.passwordVisible = !this.passwordVisible;
    }
    if(visibility == 'old'){
      this.newPasswordVisible = !this.newPasswordVisible;
    }
    if(visibility == 'confirm'){
      this.passwordConfirmVisible = !this.passwordConfirmVisible;
    }

  }

  checkPassword(new_password: any, new_password_confirmation: any): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordValue = control.get(new_password)?.value;
      const confirmPasswordValue = control.get(new_password_confirmation)?.value;

      if (passwordValue && confirmPasswordValue && passwordValue !== confirmPasswordValue) {
        return { passwordsMismatch: true };
      }
      return null;
    };
  }

  onSubmit(){
    this.authService.changePassword(this.credentialForm.value).subscribe((response) => {
      if(response.statusCode == 200){
        Swal.fire({
          title: "Success",
          text: response.message,
          icon: "success",
          confirmButtonColor: "#4690eb",
          confirmButtonText: "Continue"
        });
        this.route.navigateByUrl("home/login")
      }
      else{
        Swal.fire({
          title: "Error",
          text: response.message,
          icon: "error",
          confirmButtonColor: "#4690eb",
          confirmButtonText: "Continue"
        });
      }
    },(error) => {
      Swal.fire({
        title: 'Warning!',
        text: GlobalConstants.genericErrorConnectFail,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    });

  }
}
