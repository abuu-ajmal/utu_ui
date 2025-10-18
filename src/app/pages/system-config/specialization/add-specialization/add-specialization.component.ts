import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import Swal from 'sweetalert2';
import { SpecializationService } from '../../../../services/system-configuration/specialization.service';
import { ProfessionalService } from '../../../../services/system-configuration/professional.service';

@Component({
  selector: 'app-add-specialization',
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
    MatDialogModule,
    MatSelectModule
  ],
  templateUrl: './add-specialization.component.html',
  styleUrl: './add-specialization.component.scss'
})
export class AddSpecializationComponent implements OnInit {
  currentLanguage: 'en' | 'sw' = 'en';

  specializationForm!: FormGroup;
  specializationData: any;
  professionalTitles: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddSpecializationComponent>,
    private specializationService:SpecializationService,
    private professionalService: ProfessionalService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.specializationData = data?.data || null;
  }

  ngOnInit(): void {
    this.loadProfessionalTitles();
    this.configForm();
    if (this.specializationData) {
      this.specializationForm.patchValue(this.specializationData);
    }
  }

  loadProfessionalTitles() {
    this.professionalService.getAllProfessional().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.professionalTitles = res.data;
        }
      },
      error: (err) => console.error(err)
    });
  }

  configForm() {
    this.specializationForm = new FormGroup({
      professional_title_id: new FormControl(this.specializationData?.professional_title_id || null, Validators.required),
      name: new FormGroup({
        sw: new FormControl(this.specializationData?.name?.sw || null, Validators.required),
        en: new FormControl(this.specializationData?.name?.en || null, Validators.required)
      })
    });
  }

  saveSpecialization() {
    if (this.specializationForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: this.currentLanguage === 'sw' ? 'Fomu sio sahihi' : 'Invalid Form',
        text: this.currentLanguage === 'sw'
          ? 'Tafadhali angalia fomu na ujaribu tena.'
          : 'Please fill all required fields correctly.',
        confirmButtonText: this.currentLanguage === 'sw' ? 'Sawa' : 'OK'
      });
      return;
    }

    this.specializationService.addSpecialization(this.specializationForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.currentLanguage === 'sw' ? 'Imeongezwa' : 'Saved!',
          text: this.currentLanguage === 'sw'
            ? 'Specialization imeongezwa kwa mafanikio.'
            : 'Specialization added successfully.',
          confirmButtonText: this.currentLanguage === 'sw' ? 'Sawa' : 'OK'
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: this.currentLanguage === 'sw' ? 'Imeshindikana' : 'Failed!',
          text: this.currentLanguage === 'sw'
            ? 'Specialization haiwezi kuongezwa.'
            : 'Failed to add specialization.',
          confirmButtonText: this.currentLanguage === 'sw' ? 'Sawa' : 'OK'
        });
      }
    });
  }

  updateSpecialization() {
    if (this.specializationForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: this.currentLanguage === 'sw' ? 'Fomu sio sahihi' : 'Invalid Form',
        text: this.currentLanguage === 'sw'
          ? 'Tafadhali angalia fomu na ujaribu tena.'
          : 'Please fill all required fields correctly.',
        confirmButtonText: this.currentLanguage === 'sw' ? 'Sawa' : 'OK'
      });
      return;
    }

    const payload = this.specializationForm.value;
    this.specializationService.updateSpecialization(payload, this.specializationData.specialization_id).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.currentLanguage === 'sw' ? 'Imesasishwa' : 'Updated!',
          text: this.currentLanguage === 'sw'
            ? 'Specialization imesasishwa kwa mafanikio.'
            : 'Specialization updated successfully.',
          confirmButtonText: this.currentLanguage === 'sw' ? 'Sawa' : 'OK'
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: this.currentLanguage === 'sw' ? 'Imeshindikana' : 'Failed!',
          text: this.currentLanguage === 'sw'
            ? 'Specialization haisasishwa.'
            : 'Failed to update specialization.',
          confirmButtonText: this.currentLanguage === 'sw' ? 'Sawa' : 'OK'
        });
      }
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
