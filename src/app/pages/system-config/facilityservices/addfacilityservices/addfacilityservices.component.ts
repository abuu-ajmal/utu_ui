import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { HDividerComponent } from '@elementar/components';
import { Subject, takeUntil } from 'rxjs';
import { GlobalConstants } from '@shared/global-constants';
import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';
import { FacilityservicesService } from '../../../../services/system-configuration/facilityservices.service';

@Component({
  selector: 'app-addfacilityservices',
  standalone: true,
  imports: [
     CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatInput,
        MatFormField,
        MatLabel,
        MatDialogModule,
        MatCheckbox,
        MatError,
        ReactiveFormsModule,
        HDividerComponent,
        MatSelectModule
  ],
  templateUrl: './addfacilityservices.component.html',
  styleUrl: './addfacilityservices.component.scss'
})
export class AddfacilityservicesComponent {

readonly data = inject<any>(MAT_DIALOG_DATA);
     private readonly onDestroy = new Subject<void>()
     public sidebarVisible:boolean = true

     reasonForm: FormGroup;
     parent: any;
     uploadProgress: number = 0;
     uploading: boolean = false;
     errorMessage: string | null = null;
     reasonData: any;
     selectedAttachement: File | null = null;

     constructor(private formBuilder:FormBuilder,
       private facilityService:FacilityservicesService,
       private dialogRef: MatDialogRef<AddfacilityservicesComponent>) {
     }


     ngOnInit(): void {
         if(this.data){
           this.reasonData = this.data.data;
          // this.getHospital(this.id);
         }
         this.configForm();
       }



       ngOnDestroy(): void {
         this.onDestroy.next()
       }
       onClose() {
         this.dialogRef.close(false)
       }

       configForm(){
         this.reasonForm = new FormGroup({
          type: new FormControl(null, Validators.required),
          name: new FormControl(null, Validators.required),
          description: new FormControl(null, Validators.required),
          sku: new FormControl(null, Validators.required),
          quantity: new FormControl(null, Validators.required),

         });
         if(this.reasonData){
           this.reasonForm.patchValue(this.reasonData);
         }
       }

        onAttachmentSelected(event: any): void {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      this.reasonForm.patchValue({ identity_document: file.name });
      this.selectedAttachement = file;
    }
  }


     saveIdentity() {
  if (this.reasonForm.valid) {
    const formData = new FormData();

    // Append all form fields
    Object.keys(this.reasonForm.controls).forEach((key) => {
      formData.append(key, this.reasonForm.get(key)?.value);
    });

    // Append file if selected
    if (this.selectedAttachement) {
      formData.append('identity_document', this.selectedAttachement);
    }

    this.facilityService.addFacilityServices(formData).subscribe(
      (response: any) => {
        if (response.statusCode === 201) {
          Swal.fire({
            title: 'Success',
            text: 'Data saved successfully',
            icon: 'success',
            confirmButtonColor: '#4690eb',
            confirmButtonText: 'Continue',
          });

          // Optional: reset form after save
          this.reasonForm.reset();
          this.selectedAttachement = null;
        } else {
          Swal.fire({
            title: 'Error',
            text: response.message || 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#4690eb',
            confirmButtonText: 'Continue',
          });
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Failed to connect to server',
          icon: 'error',
          confirmButtonColor: '#4690eb',
          confirmButtonText: 'OK',
        });
      }
    );
  } else {
    Swal.fire({
      title: 'Validation Failed',
      text: 'Please fill all required fields before submitting.',
      icon: 'warning',
      confirmButtonColor: '#4690eb',
      confirmButtonText: 'OK',
    });
  }
}

       updateIdentity(){
         if(this.reasonForm.valid){
          this.facilityService.updateFacilityServices(this.reasonForm.value, this.reasonData.reason_id).subscribe(response=>{
             if(response.statusCode == 200){
               Swal.fire({
                 title: "Success",
                 text: "Data saved successfull",
                 icon: "success",
                 confirmButtonColor: "#4690eb",
                 confirmButtonText: "Continue"
               });
             }else{
               Swal.fire({
                 title: "Error",
                 text: response.message,
                 icon: "error",
                 confirmButtonColor: "#4690eb",
                 confirmButtonText: "Continue"
               });
             }
           }

         );
         }else{

         }
       }
 }

