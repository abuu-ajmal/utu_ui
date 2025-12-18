import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { SlotService } from '../../../services/proffession/slot.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-addslots',
  standalone: true,
  imports: [
     CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
  ],
  templateUrl: './addslots.component.html',
  styleUrl: './addslots.component.scss'
})
export class AddslotsComponent {

 form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private slotService: SlotService,
    public dialogRef: MatDialogRef<AddslotsComponent>
  ) {
    this.form = this.fb.group({
      start_time: ['', Validators.required],
      end_time: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.slotService.addSlots(this.form.value).subscribe({
      next: () => {
        Swal.fire('Success', 'Slot added successfully', 'success');
        this.dialogRef.close(true);
      },
      error: () => Swal.fire('Error', 'Failed to add slot', 'error')
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
