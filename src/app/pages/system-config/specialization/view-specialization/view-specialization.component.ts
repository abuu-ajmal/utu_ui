import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from '../../../../services/authentication/permission.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { EmrSegmentedModule } from '@elementar/components';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddSpecializationComponent } from '../add-specialization/add-specialization.component';
import { ProfessionalService } from '../../../../services/system-configuration/professional.service';
import { SpecializationService } from '../../../../services/system-configuration/specialization.service';

@Component({
  selector: 'app-view-specialization',
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
  templateUrl: './view-specialization.component.html',
  styleUrl: './view-specialization.component.scss'
})
export class ViewSpecializationComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();

  // Table Columns
 displayedColumns: string[] = ['id', 'specialization', 'title', 'action'];
dataSource: MatTableDataSource<any> = new MatTableDataSource();

  // Language (default English)
  currentLanguage: 'en' | 'sw' = 'en';

  // Translations for English and Kiswahili
 translations = {
  en: {
    title: 'Specialization',
    addProfessional: 'Add Specialization Title',
    searchPlaceholder: 'Search Specialization Title...',
    columnId: 'ID',
    columnTitle: 'Professional Title',
    columnSpecialization: 'Specialization',
    columnAction: 'Action',
    noData: 'No Professional Titles Found',
  },
  sw: {
    title: 'Vyeo vya Kitaaluma',
    addProfessional: 'Ongeza Cheo cha Kitaaluma',
    searchPlaceholder: 'Tafuta Cheo cha Kitaaluma...',
    columnId: 'Kitambulisho',
    columnTitle: 'Cheo cha Kitaaluma',
    columnSpecialization: 'Utaalamu',
    columnAction: 'Kitendo',
    noData: 'Hakuna Vyeo vya Kitaaluma Vilivopatikana',
  },
};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public permission: PermissionService,
    public proServices: ProfessionalService,
    public speServices: SpecializationService,
    private route: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProfessionalTitles();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  // Switch between English and Kiswahili
  switchLanguage(lang: 'en' | 'sw') {
    this.currentLanguage = lang;
  }

  renew() {
    this.getProfessionalTitles();
  }

getProfessionalTitles() {
  this.speServices.getAllSpecialization() // replace with professional service if separate
    .pipe(takeUntil(this.onDestroy))
    .subscribe((res: any) => {
      if (res.statusCode === 200 && res.success) {
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data, filter) => {
          const titleEn = data.title?.title?.en?.toLowerCase() || '';
          const titleSw = data.title?.title?.sw?.toLowerCase() || '';
          const specEn = data.name?.en?.toLowerCase() || '';
          const specSw = data.name?.sw?.toLowerCase() || '';
          const id = String(data.specialization_id || '');
          filter = filter.toLowerCase();
          return titleEn.includes(filter) || titleSw.includes(filter) || specEn.includes(filter) || specSw.includes(filter) || id.includes(filter);
        };
      }
    });
}


  // Search filter
 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  this.dataSource.filter = filterValue;

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}


  // Add new professional
  addSpecialiazation() {
    let config = new MatDialogConfig();
    config.disableClose = false;
    config.role = 'dialog';
    config.maxWidth = '100vw';
    config.maxHeight = '100vh';
    config.width = '850px';
    config.panelClass = 'full-screen-modal';

    const dialogRef = this.dialog.open(AddSpecializationComponent, config);

    dialogRef.afterClosed().subscribe(() => {
      this.getProfessionalTitles();
    });
  }

  // Update existing professional
  updateSpecialization(data: any) {
    let config = new MatDialogConfig();
    config.disableClose = false;
    config.role = 'dialog';
    config.maxWidth = '100vw';
    config.maxHeight = '100vh';
    config.width = '850px';
    config.panelClass = 'full-screen-modal';
    config.data = { data: data };

    const dialogRef = this.dialog.open(AddSpecializationComponent, config);

    dialogRef.afterClosed().subscribe(() => {
      this.getProfessionalTitles();
    });
  }
}
