import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { Router } from 'express';
import { Subject, takeUntil } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMiniFabButton, MatIconButton, MatAnchor, MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { EmrSegmentedModule, VDividerComponent } from '@elementar/components';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment.prod';
import { PermissionService } from '../../../services/authentication/permission.service';
import { ProffService } from '../../../services/proffession/proff.service';
import Swal from 'sweetalert2';
import { AddproffComponent } from '../addproff/addproff.component';
import { AddservicesComponent } from '../addservices/addservices.component';

@Component({
  selector: 'app-viewproff',
  standalone: true,
  imports: [
     CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDivider,
    MatIcon,
    MatMiniFabButton,
    MatIconButton,
    VDividerComponent,
    MatTooltip,
    MatSlideToggleModule,
    FormsModule,
    MatAnchor,
    MatButton,
    RouterLink,
    EmrSegmentedModule
  ],
  templateUrl: './viewproff.component.html',
  styleUrl: './viewproff.component.scss'
})
export class ViewproffComponent implements OnInit {
  public documentUrl = environment.fileUrl;
  professionals: any[] = [];

  constructor(
    public permission: PermissionService,
    private professionalService: ProffService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProfessionals();
  }

  renew() {
    this.getProfessionals();
  }

  getProfessionals() {
    this.professionalService.getAllProffessional().subscribe({
      next: (response: any) => {
        if (response.statusCode === 200) {
          this.professionals = response.data;
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      },
      error: (err) => {
        Swal.fire('Error', 'Failed to load professional data', 'error');
      },
    });
  }

  viewFile(filePath: string) {
    const fullUrl = this.documentUrl + filePath;
    window.open(fullUrl, '_blank');
  }



addProfessional() {
  const dialogRef = this.dialog.open(AddproffComponent, {
    width: '90vw',          // 90% of viewport width (responsive)
    maxWidth: '1200px',     // maximum width on large screens
    panelClass: 'custom-dialog-container', // optional for extra style
    disableClose: false,
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      console.log('Form data:', result);
      // Call your API service here to save professional
    }
  });
}

updateProfessional(prof: any) {
  const dialogRef = this.dialog.open(AddproffComponent, {
    width: '90vw',       // large modal
    maxWidth: '1200px',
    disableClose: false,
    data: prof,          // pass professional data for editing
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      console.log('Professional updated:', result);
      this.getProfessionals(); // reload list
    }
  });
}

addServices(prof: any): void {
  const dialogRef = this.dialog.open(AddservicesComponent, {
    // width: '90vw',       // large modal
    maxWidth: '1000px',
    disableClose: false,
    data: prof,          // pass professional data for editing
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      console.log('Professional updated:', result);
      this.getProfessionals(); // reload list
    }
  });
}

deleteService(professionalId: number, serviceId: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This will remove the selected service from this professional.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      this.professionalService
        .deleteAssignedService(professionalId, serviceId)
        .subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'Service removed successfully.', 'success');

            // Update the local UI
            this.professionals = this.professionals.map((p: any) => {
              if (p.professional_id === professionalId) {
                p.services = p.services.filter(
                  (s: any) =>
                    s.service_id !== serviceId && s.id !== serviceId
                );
              }
              return p;
            });
          },
          error: (err) => {
            console.error('Error deleting service:', err);
            Swal.fire('Error', 'Failed to remove service.', 'error');
          },
        });
    }
  });
}




}
