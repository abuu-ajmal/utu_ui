import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RegistrationService } from '../../../services/users/registration.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
 personalFormGroup = this.fb.group({
    full_name: ['', Validators.required],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
  });

  contactFormGroup = this.fb.group({
    phone: ['', Validators.required],
    email: ['', Validators.required],
    address: [''],
  });

  finalFormGroup = this.fb.group({
    role: ['', Validators.required],
    terms_accepted: [false, Validators.requiredTrue],
  });

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
     private router: Router
  ) {}

 onSubmit() {
  if (
    this.personalFormGroup.valid &&
    this.contactFormGroup.valid &&
    this.finalFormGroup.valid
  ) {
    const formData = {
      ...this.personalFormGroup.value,
      ...this.contactFormGroup.value,
      ...this.finalFormGroup.value,
    };

    // Show loader
    Swal.fire({
      title: 'Saving...',
      html: 'Please wait while your registration is being processed.',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    this.registrationService.createAccount(formData).subscribe({
      next: (response: any) => {
        Swal.close(); // close the loader

        // Success alert
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful ✅',
          html: `
            <p>${response.message}</p>
            <p><strong>Phone:</strong> ${response.data.phone}</p>
            <p><strong>Email:</strong> ${response.data.email}</p>
            <p><strong>Password:</strong> ${response.data.password}</p>
          `,
          confirmButtonText: 'Go to Change Password'
        }).then((result) => {
          if (result.isConfirmed) {
            // Navigate to change-password page
            this.router.navigate(['/home/user-login']);
          }
        });

        this.resetForms();
      },
      error: (err) => {
        Swal.close(); // close the loader

        Swal.fire({
          icon: 'error',
          title: 'Registration Failed ❌',
          text: 'Please try again later.',
          confirmButtonText: 'OK'
        });
      },
    });
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Form ⚠️',
      text: 'Please complete all required fields before submitting.',
      confirmButtonText: 'OK'
    });
  }
}


  resetForms() {
    this.personalFormGroup.reset();
    this.contactFormGroup.reset();
    this.finalFormGroup.reset();
  }
}
