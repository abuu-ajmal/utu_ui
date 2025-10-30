import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';



import Swal from 'sweetalert2';
import { EducationlevelService } from '../../../services/system-configuration/educationlevel.service';
import { SpecializationService } from '../../../services/system-configuration/specialization.service';
import { ProfessionalService } from '../../../services/system-configuration/professional.service';
import { ProffService } from '../../../services/proffession/proff.service';

@Component({
  selector: 'app-addproff',
  standalone: true,
  imports: [
     CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule
  ],
  templateUrl: './addproff.component.html',
  styleUrl: './addproff.component.scss'
})
export class AddproffComponent implements OnInit {
  basicForm!: FormGroup;
  documentForm!: FormGroup;
  photoForm!: FormGroup;
  filteredSpecializations: any[] = [];

  professionalTitles: any[] = [];
  specializations: any[] = [];
  educationLevels: any[] = [];

  selectedPhotoPreview: string | ArrayBuffer | null = null;
  formData = new FormData();
  isUpdateMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddproffComponent>,
    @Inject(MAT_DIALOG_DATA) public profData: any, // data for editing
    private professionalService: ProfessionalService,
    private educationService: EducationlevelService,
    private proffServices: ProffService,
    private specializationService: SpecializationService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadDropdownData();

    if (this.profData) {
      this.isUpdateMode = true;
      this.patchFormData();
    }
  }

  initForms() {
    this.basicForm = this.fb.group({
      professional_title_id: ['', Validators.required],
      specialization_id: ['', Validators.required],
      education_level_id: ['', Validators.required],
    });

    this.documentForm = this.fb.group({
      education_level_certificate: [''],
      cv: [''],
      license: [''],
      work_permit: [''],
    });

    this.photoForm = this.fb.group({
      photo: [''],
    });
  }

  loadDropdownData() {
  this.specializationService.getAllSpecialization().subscribe((res: any) => {
    if (res.success && res.data) {
      this.specializations = res.data;

      // Extract unique professional titles from nested data
      const titlesMap = new Map();
      res.data.forEach((item: any) => {
        if (item.title && !titlesMap.has(item.title.professional_title_id)) {
          titlesMap.set(item.title.professional_title_id, item.title);
        }
      });
      this.professionalTitles = Array.from(titlesMap.values());
    }
  });

  this.educationService.getAllEducationLevel().subscribe((res: any) => {
    this.educationLevels = res.data;
  });
}


  // loadDropdownData() {
  //   this.professionalService.getAllProfessional().subscribe((res: any) => {
  //     this.professionalTitles = res.data;
  //   });

  //   this.educationService.getAllEducationLevel().subscribe((res: any) => {
  //     this.educationLevels = res.data;
  //   });

  //   this.specializationService.getAllSpecialization().subscribe((res: any) => {
  //     this.specializations = res.data;
  //   });
  // }

  patchFormData() {
  this.basicForm.patchValue({
    professional_title_id: this.profData.professional_title_id,
    specialization_id: this.profData.specialization_id,
    education_level_id: this.profData.education_level_id,
  });

  // Filter specializations for the selected title
  this.onTitleChange(this.profData.professional_title_id);

  if (this.profData.photo) {
    this.selectedPhotoPreview = this.profData.photo.startsWith('http')
      ? this.profData.photo
      : this.profData.photo;
  }
}


  // patchFormData() {

  //   this.basicForm.patchValue({
  //     professional_title_id: this.profData.professional_title_id,
  //     specialization_id: this.profData.specialization_id,
  //     education_level_id: this.profData.education_level_id,
  //   });


  //   if (this.profData.photo) {
  //     this.selectedPhotoPreview = this.profData.photo.startsWith('http')
  //       ? this.profData.photo
  //       : this.profData.photo;
  //   }
  // }

  onTitleChange(selectedTitleId: number) {
  this.filteredSpecializations = this.specializations.filter(
    (s: any) => s.professional_title_id === selectedTitleId
  );

  // Reset specialization field
  this.basicForm.patchValue({ specialization_id: '' });
}

  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate photo type
    if (field === 'photo' && !['image/png', 'image/jpeg'].includes(file.type)) {
      alert('Only PNG or JPG images are allowed for Photo.');
      return;
    }

    this.formData.set(field, file);

    // Preview photo
    if (field === 'photo') {
      const reader = new FileReader();
      reader.onload = () => (this.selectedPhotoPreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    const combinedData = {
      ...this.basicForm.value,
      ...this.documentForm.value,
      ...this.photoForm.value,
    };

    Object.keys(combinedData).forEach((key) => {
      if (this.formData.has(key)) return;
      this.formData.append(key, combinedData[key]);
    });

    // Choose correct API call
    const request$ = this.isUpdateMode
      ? this.proffServices.updateProffessional(this.profData.professional_id, this.formData)
      : this.proffServices.addProffessional(this.formData);

    request$.subscribe({
      next: (res) => {
        if (res.statusCode === 200 || res.success) {
          Swal.fire({
            icon: 'success',
            title: this.isUpdateMode
              ? 'Professional Updated Successfully!'
              : 'Professional Added Successfully!',
          });
          this.dialogRef.close(true);
        }
      },
      error: (err) => {
        console.error(err);
        if (err.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Professional',
            text: err.error?.message || 'This user already has this professional title.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: this.isUpdateMode
              ? 'Failed to update professional'
              : 'Failed to save professional',
            text: err.error?.message || 'Something went wrong. Please try again.',
          });
        }
      },
    });
  }

  viewFile(fileUrl: string) {
    if (!fileUrl) return;
    window.open(fileUrl, '_blank');
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
