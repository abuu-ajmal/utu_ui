import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProserviceService } from '../../../services/system-configuration/proservice.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfessionalService } from '../../../services/system-configuration/professional.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-addproservices',
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
  templateUrl: './addproservices.component.html',
  styleUrl: './addproservices.component.scss'
})
export class AddproservicesComponent implements OnInit {
  serviceForm!: FormGroup;
  loading = false;

  professionalTitles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private proserviceService: ProserviceService,
    private professionalService: ProfessionalService,
    private dialogRef: MatDialogRef<AddproservicesComponent>
  ) {}

  ngOnInit(): void {
    this.loadProfessionalTitles();
    this.serviceForm = this.fb.group({
      professional_title_id: new FormControl( null, Validators.required),
      service_name_en: ['', Validators.required],
      service_name_sw: ['', Validators.required],
      service_description_en: ['', Validators.required],
      service_description_sw: ['', Validators.required],
      service_price: ['', [Validators.required, Validators.min(0)]],
    });
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

  /** ✅ Submit Form */
  onSubmit() {
    if (this.serviceForm.invalid) {
      Swal.fire('Error', 'Please fill all required fields.', 'error');
      return;
    }

    const payload = {
      professional_title_id: this.serviceForm.value.professional_title_id,
      service_name: {
        en: this.serviceForm.value.service_name_en,
        sw: this.serviceForm.value.service_name_sw,
      },
      service_description: {
        en: this.serviceForm.value.service_description_en,
        sw: this.serviceForm.value.service_description_sw,
      },
      service_price: this.serviceForm.value.service_price,
    };

    this.loading = true;
    this.proserviceService.addServices(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.statusCode === 200 || res.success) {
          Swal.fire('Success', 'Service added successfully.', 'success');
          this.dialogRef.close(true);
        } else {
          Swal.fire('Error', 'Failed to add service.', 'error');
        }
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        Swal.fire('Error', 'Something went wrong.', 'error');
      },
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
