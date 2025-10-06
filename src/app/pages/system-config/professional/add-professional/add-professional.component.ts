import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Subject } from 'rxjs';
import { ProfessionalService } from '../../../../services/system-configuration/professional.service';
import Swal from 'sweetalert2';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-add-professional',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInput,
    MatFormField,
    MatLabel,
    MatError,
    MatCard,
    ReactiveFormsModule
  ],
  templateUrl: './add-professional.component.html',
  styleUrls: ['./add-professional.component.scss']
})
export class AddProfessionalComponent implements OnInit, OnDestroy {

  readonly data = inject<any>(MAT_DIALOG_DATA);
  private readonly onDestroy = new Subject<void>();

  professionForm: FormGroup;
  professionData: any;

  constructor(
    private formBuilder: FormBuilder,
    private proServices: ProfessionalService,
    private dialogRef: MatDialogRef<AddProfessionalComponent>
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.professionData = this.data.data;
      console.log("imefika data",this.professionData)
    }
    this.configForm();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
  }

  onClose() {
    this.dialogRef.close(false);
  }

  configForm() {
    this.professionForm = new FormGroup({
      title: new FormGroup({
        sw: new FormControl(null, Validators.required),
        en: new FormControl(null, Validators.required)
      })
    });

    if (this.professionData) {
      this.professionForm.patchValue(this.professionData);
    }
  }

  saveProfession() {
    if (this.professionForm.valid) {
      this.proServices.addProfessional(this.professionForm.value).subscribe(response => {
        if (response.statusCode == 201) {
          Swal.fire({
            title: 'Success',
            text: 'Professional added successfully',
            icon: 'success',
            confirmButtonColor: '#4690eb',
            confirmButtonText: 'Continue'
          });
          this.dialogRef.close(true);
        } else {
          Swal.fire({
            title: 'Error',
            text: response.message,
            icon: 'error',
            confirmButtonColor: '#4690eb',
            confirmButtonText: 'Continue'
          });
        }
      });
    }
  }

  updateProfession() {
    if (this.professionForm.valid) {
      this.proServices.updateProfessional(this.professionForm.value, this.professionData?.id).subscribe(response => {
        if (response.statusCode == 200) {
          Swal.fire({
            title: 'Success',
            text: 'Professional updated successfully',
            icon: 'success',
            confirmButtonColor: '#4690eb',
            confirmButtonText: 'Continue'
          });
          this.dialogRef.close(true);
        } else {
          Swal.fire({
            title: 'Error',
            text: response.message,
            icon: 'error',
            confirmButtonColor: '#4690eb',
            confirmButtonText: 'Continue'
          });
        }
      });
    }
  }
}
