import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { SlotService } from '../../../services/proffession/slot.service';
import { AddslotsComponent } from '../addslots/addslots.component';

@Component({
  selector: 'app-viewslots',
  standalone: true,
  imports: [
     CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './viewslots.component.html',
  styleUrl: './viewslots.component.scss'
})
export class ViewslotsComponent implements OnInit {

  slots: any[] = [];
  loading = false;

  constructor(private slotService: SlotService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadSlots();
  }

  loadSlots() {
    this.loading = true;

    this.slotService.getAllSlots().subscribe({
      next: (res: any) => {
        this.slots = res.data || res; // in case API returns "data"
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Failed to load slots', 'error');
      }
    });
  }

  onAddSlot() {
    const dialogRef = this.dialog.open(AddslotsComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadSlots();
    });
  }

  onDelete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this slot',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete'
    }).then((res) => {
      if (res.isConfirmed) {
        this.slotService.deleteSlots(id).subscribe({
          next: () => {
            Swal.fire('Deleted', 'Slot deleted successfully', 'success');
            this.loadSlots();
          },
          error: () => Swal.fire('Error', 'Failed to delete slot', 'error'),
        });
      }
    });
  }
}
