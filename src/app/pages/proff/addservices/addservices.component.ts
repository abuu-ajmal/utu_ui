import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfessionalService } from '../../../services/system-configuration/professional.service';

@Component({
  selector: 'app-addservices',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './addservices.component.html',
  styleUrl: './addservices.component.scss'
})
export class AddservicesComponent implements OnInit {
 basicForm!: FormGroup;
  allServices: any[] = [];
  professional: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddservicesComponent>,
    @Inject(MAT_DIALOG_DATA) public profData: any,
    private professionalService: ProfessionalService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('Professional ID passed to dialog:', this.profData.professional_id);
    this.initForm();
    this.loadProfessionalData();
  }

  /** Initialize Form */
  initForm() {
    this.basicForm = this.fb.group({
      professional_id: [null, Validators.required], // ✅ added this
      service_ids: this.fb.array([], Validators.required)
    });
  }

  /** Getter for service_ids array */
  get serviceIds(): FormArray {
    return this.basicForm.get('service_ids') as FormArray;
  }

  /** Load Professional and Services Data */
  loadProfessionalData() {
    const professionalId = this.profData?.professional_id;
    if (!professionalId) {
      console.error('No professional ID provided');
      return;
    }

    console.log('Fetching professional with ID:', professionalId);

    this.professionalService.getProfessionalById(professionalId).subscribe({
      next: (res: any) => {
        console.log('Full API response:', res);

        if (Array.isArray(res) && res.length > 0) {
          this.professional = res[0];
        } else if (res && typeof res === 'object') {
          this.professional = res;
        } else {
          console.warn('Professional data not found');
          this.professional = null;
          return;
        }

        console.log('Professional object:', this.professional);

        // ✅ Patch professional_id to the form
        this.basicForm.patchValue({
          professional_id: this.professional.professional_id
        });

        // Load available services
        this.allServices = this.professional.services || [];
        console.log('All services:', this.allServices);
      },
      error: (err) => {
        console.error('Error loading professional:', err);
      }
    });
  }

  /** Handle checkbox selection */
  toggleServiceSelection(serviceId: number, event: any) {
    const formArray = this.serviceIds;
    if (event.target.checked) {
      formArray.push(this.fb.control(serviceId));
    } else {
      const index = formArray.controls.findIndex(x => x.value === serviceId);
      if (index !== -1) formArray.removeAt(index);
    }
  }

  /** Submit selected services */
  onSubmit() {
    if (this.basicForm.invalid) {
      Swal.fire('Error', 'Please select at least one service.', 'error');
      return;
    }

    const professionalId = this.basicForm.value.professional_id;
    const serviceIds = this.basicForm.value.service_ids;

    if (!professionalId) {
      Swal.fire('Error', 'Professional ID is missing.', 'error');
      return;
    }

    if (!serviceIds || serviceIds.length === 0) {
      Swal.fire('Error', 'Please select at least one service.', 'error');
      return;
    }

    const payload = { service_ids: serviceIds };

    console.log('Submitting payload:', payload);
    console.log('Professional ID:', professionalId);

    this.http
      .post(`http://127.0.0.1:8000/api/services/assign-services/${professionalId}`, payload)
      .subscribe({
        next: (res: any) => {
          Swal.fire('Success', 'Services assigned successfully!', 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error assigning services:', err);
          Swal.fire('Error', 'Failed to assign services.', 'error');
        },
      });
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
