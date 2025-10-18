import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import Swal from 'sweetalert2';
import { EducationlevelService } from '../../../../services/system-configuration/educationlevel.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-educationlevel',
  standalone: true,
   imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
   ],
  templateUrl: './add-educationlevel.component.html',
  styleUrl: './add-educationlevel.component.scss'
})
export class AddEducationlevelComponent implements OnInit {
  currentLanguage: 'en' | 'sw' = 'en'; // add this at the top of the class

  educationForm!: FormGroup;
  educationData: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEducationlevelComponent>,
    private educationService: EducationlevelService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.educationData = data?.data || null;
  }

  ngOnInit(): void {
    this.configForm();
    if (this.educationData) {
      this.educationForm.patchValue(this.educationData);

    }
  }

  configForm() {
    this.educationForm = new FormGroup({
      level: new FormGroup({
        sw: new FormControl(null, Validators.required),
        en: new FormControl(null, Validators.required)
      })
    });
  }



saveEducationLevel() {
  if (this.educationForm.invalid) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: this.currentLanguage === 'sw'
        ? 'Fomu sio sahihi. Tafadhali angalia tena.'
        : 'Form is invalid. Please check again.',
      confirmButtonText: this.currentLanguage === 'sw' ? 'Sawa' : 'OK'
    });
    return;
  }

  this.educationService.addEducationLevel(this.educationForm.value).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: this.currentLanguage === 'sw' ? 'Imesajiliwa' : 'Saved!',
        text: this.currentLanguage === 'sw' ? 'Kiwango cha elimu kimeongezwa kwa mafanikio.' : 'Education level added successfully.',
        confirmButtonText: this.currentLanguage === 'sw' ? 'Sawa' : 'OK'
      });
      this.dialogRef.close(true);
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: this.currentLanguage === 'sw' ? 'Imeshindikana' : 'Failed!',
        text: this.currentLanguage === 'sw' ? 'Kiwango cha elimu hakijaweza kuongezwa.' : 'Failed to add education level.',
        confirmButtonText: this.currentLanguage === 'sw' ? 'Sawa' : 'OK'
      });
      console.error(err);
    }
  });
}

updateEducationLevel() {
  if (this.educationForm.invalid) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: this.currentLanguage === 'sw'
        ? 'Fomu sio sahihi. Tafadhali angalia tena.'
        : 'Form is invalid. Please check again.',
      confirmButtonText: this.currentLanguage === 'sw' ? 'Sawa' : 'OK'
    });
    return;
  }

  const payload = this.educationForm.value; // already contains "level"

  this.educationService.updateEducationLevel(payload, this.educationData.id).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: this.currentLanguage === 'sw' ? 'Imesasishwa' : 'Updated!',
        text: this.currentLanguage === 'sw'
          ? 'Kiwango cha elimu kimesasishwa kwa mafanikio.'
          : 'Education level updated successfully.',
        confirmButtonText: this.currentLanguage === 'sw' ? 'Sawa' : 'OK'
      });
      this.dialogRef.close(true);
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: this.currentLanguage === 'sw' ? 'Imeshindikana' : 'Failed!',
        text: this.currentLanguage === 'sw'
          ? 'Kiwango cha elimu hakijasasishwa.'
          : 'Failed to update education level.',
        confirmButtonText: this.currentLanguage === 'sw' ? 'Sawa' : 'OK'
      });
      console.error(err);
    }
  });
}



  onClose() {
    this.dialogRef.close();
  }
}
