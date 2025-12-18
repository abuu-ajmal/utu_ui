import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SlotService } from '../../../services/proffession/slot.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-addsetslots',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatSelectModule,
    MatProgressSpinner
],
  templateUrl: './addsetslots.component.html',
  styleUrl: './addsetslots.component.scss'
})
export class AddsetslotsComponent implements OnInit {
  form: FormGroup;

  allSlots: any[] = [];
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddsetslotsComponent>,
    private fb: FormBuilder,
    private slotService: SlotService
  ) {
    this.form = this.fb.group({
     slot_id: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchSlots();
  }

 fetchSlots() {
  this.loading = true;

  this.slotService.getAllSlots().subscribe({
    next: (res: any) => {
      console.log('API response:', res); // Debug check
      // If API returns array directly
      this.allSlots = res || [];
      this.loading = false;
    },
    error: (err) => {
      console.error('Error fetching slots:', err);
      this.loading = false;
    }
  });
}

 save() {
  if (this.form.invalid) return;

  const selectedSlots = this.form.value.slot_id; // Array of selected slot IDs
  console.log('Selected Slots:', selectedSlots);

  if (selectedSlots.length === 0) {
    // Optional: show error if no slots selected
    return;
  }

  // Prepare payload for API
  const payload = { slot_id: selectedSlots };

  this.loading = true; // optional spinner
  this.slotService.setSlots(payload).subscribe({
    next: (res) => {
      console.log('Slots saved successfully:', res);
      this.loading = false;
      // Close dialog and return response to parent
      this.dialogRef.close(res);
    },
    error: (err) => {
      console.error('Error saving slots:', err);
      this.loading = false;
      // Optional: show snack bar or error message
    }
  });
}


  closeDialog() {
    this.dialogRef.close();
  }
}
