import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { EmrSegmentedModule } from '@elementar/components';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { PermissionService } from '../../../services/authentication/permission.service';
import { ProserviceService } from '../../../services/system-configuration/proservice.service';
import { AddproservicesComponent } from '../addproservices/addproservices.component';

@Component({
  selector: 'app-viewproservices',
  standalone: true,
  imports: [
     CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIcon,
    MatTooltip,
    MatSlideToggleModule,
    FormsModule,
    MatButton,
    EmrSegmentedModule,
  ],
  templateUrl: './viewproservices.component.html',
  styleUrl: './viewproservices.component.scss'
})
export class ViewproservicesComponent implements OnInit, OnDestroy {
 private readonly onDestroy = new Subject<void>();

  displayedColumns: string[] = ['index', 'service_name', 'service_description', 'service_price', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  currentLanguage: 'en' | 'sw' = 'en';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public permission: PermissionService,
    public servicesService: ProserviceService,
    private route: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllServices();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  switchLanguage(lang: 'en' | 'sw') {
    this.currentLanguage = lang;
    // reapply filter when language changes
    this.dataSource.filter = this.dataSource.filter;
  }

  /** ✅ Fetch All Services */
  getAllServices() {
    this.servicesService
      .getAllServices()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((res: any) => {
        if (res.statusCode === 200 && res.success) {
          this.dataSource = new MatTableDataSource(res.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          /** ✅ Fix: Correct filter logic */
          this.dataSource.filterPredicate = (data, filter) => {
            const name = data.service_name?.[this.currentLanguage]?.toLowerCase() || '';
            const desc = data.service_description?.[this.currentLanguage]?.toLowerCase() || '';
            const price = String(data.service_price || '').toLowerCase();
            return (
              name.includes(filter) ||
              desc.includes(filter) ||
              price.includes(filter)
            );
          };
        }
      });
  }

  /** 🔍 Search filter */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  /** 🔄 Refresh */
  renew() {
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) searchInput.value = '';
    this.dataSource.filter = '';
    this.getAllServices();
  }

  /** ➕ Add Service */
  addService() {
    const config = new MatDialogConfig();
    config.disableClose = false;
   
    config.role = 'dialog';



    const dialogRef = this.dialog.open(AddproservicesComponent, config);
    dialogRef.afterClosed().subscribe(() => this.getAllServices());
  }

  /** 🗑️ Delete service */
  deleteService(serviceId: number) {
    Swal.fire({
      title: this.currentLanguage === 'sw' ? 'Una uhakika?' : 'Are you sure?',
      text: this.currentLanguage === 'sw'
        ? 'Huduma hii itafutwa kabisa.'
        : 'This service will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: this.currentLanguage === 'sw' ? 'Ndiyo, futa!' : 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicesService.deleteServices(serviceId).subscribe({
          next: () => {
            Swal.fire(
              this.currentLanguage === 'sw' ? 'Imefutwa!' : 'Deleted!',
              this.currentLanguage === 'sw'
                ? 'Huduma imefutwa kwa mafanikio.'
                : 'Service deleted successfully.',
              'success'
            );
            this.getAllServices();
          },
          error: (err) => {
            console.error('Error deleting service:', err);
            Swal.fire(
              'Error',
              this.currentLanguage === 'sw'
                ? 'Imeshindikana kufuta huduma.'
                : 'Failed to delete service.',
              'error'
            );
          },
        });
      }
    });
  }
}
