import { AddsetslotsComponent } from './../addsetslots/addsetslots.component';
import { Component, OnInit } from '@angular/core';
import { SlotService } from '../../../services/proffession/slot.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-setslots',
  standalone: true,
  imports: [
     CommonModule,
      MatCardModule,
      MatButtonModule,
      MatIconModule,
      MatDialogModule,
      MatDivider
  ],
  templateUrl: './setslots.component.html',
  styleUrl: './setslots.component.scss'
})
export class SetslotsComponent implements OnInit {
  slots: any[] = [];
  professionalId = 1;

  constructor(private availabilityService: SlotService,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadSlots();
  }

  loadSlots() {
    this.availabilityService.getAvailabilities().subscribe(res => {
      this.slots = res.data;
    });
  }

  getDayName(day: number): string {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return days[day];
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
          this.availabilityService.deleteAvailableSlots(id).subscribe({
            next: () => {
              Swal.fire('Deleted', 'Slot deleted successfully', 'success');
              this.loadSlots();
            },
            error: () => Swal.fire('Error', 'Failed to delete slot', 'error'),
          });
        }
      });
    }
  openAddSlotsDialog() {
  const dialogRef = this.dialog.open(AddsetslotsComponent, {
    width: '450px',
    autoFocus: false,
    panelClass: 'custom-dialog'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'refresh') {
      this.loadSlots(); // refresh list
    }
  });
}
}
