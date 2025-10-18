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
import { EducationlevelService } from '../../../../services/system-configuration/educationlevel.service';
import { AddEducationlevelComponent } from '../add-educationlevel/add-educationlevel.component';


@Component({
 selector: 'app-view-educationlevel',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIcon,
    MatSlideToggleModule,
    FormsModule,

    EmrSegmentedModule,
  ],
 templateUrl: './view-educationlevel.component.html',
  styleUrl: './view-educationlevel.component.scss'
})
export class ViewEducationLevelComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();

  // Table Columns
  displayedColumns: string[] = ['id', 'level', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  // Language (default English)
  currentLanguage: 'en' | 'sw' = 'en';

  // Translations for English and Kiswahili
  translations = {
    en: {
      title: 'Education Levels',
      addEducationLevel: 'Add Education Level',
      updateEducationLevel: 'Update Education Level',
      searchPlaceholder: 'Search Education Level...',
      columnId: 'ID',
      columnLevel: 'Level',
      columnAction: 'Action',
      noData: 'No Education Levels Found',
    },
    sw: {
      title: 'Ngazi za Elimu',
      addEducationLevel: 'Ongeza Ngazi ya Elimu',
      updateEducationLevel: 'Hariri Ngazi ya Elimu',
      searchPlaceholder: 'Tafuta Ngazi ya Elimu...',
      columnId: 'Kitambulisho',
      columnLevel: 'Ngazi',
      columnAction: 'Kitendo',
      noData: 'Hakuna Ngazi za Elimu Zilizopatikana',
    },
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public permission: PermissionService,
    public eduLevelService: EducationlevelService,
    private route: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getEducationLevels();
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
    this.getEducationLevels();
  }

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  this.dataSource.filter = filterValue;

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

getEducationLevels() {
  this.eduLevelService
    .getAllEducationLevel()
    .pipe(takeUntil(this.onDestroy))
    .subscribe(
      (response: any) => {
        if (response.statusCode === 200 && response.success) {
          this.dataSource = new MatTableDataSource(response.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          // ✅ Custom filter for nested level translations
          this.dataSource.filterPredicate = (data, filter) => {
            const english = data.level?.en?.toLowerCase() || '';
            const swahili = data.level?.sw?.toLowerCase() || '';
            const id = String(data.id || '');
            return (
              english.includes(filter) ||
              swahili.includes(filter) ||
              id.includes(filter)
            );
          };
        } else {
          console.log('Failed to load education levels.');
        }
      },
      (error) => {
        console.log('Error fetching education levels:', error);
        this.route.navigateByUrl('/');
      }
    );
}


  // Add new education level
  addEducationLevel() {
    let config = new MatDialogConfig();
    config.disableClose = false;
    config.role = 'dialog';
    config.maxWidth = '100vw';
    config.maxHeight = '100vh';
    config.width = '850px';
    config.panelClass = 'full-screen-modal';

    const dialogRef = this.dialog.open(AddEducationlevelComponent, config);

    dialogRef.afterClosed().subscribe(() => {
      this.getEducationLevels();
    });
  }

  // Update existing education level
  updateEducationLevel(data: any) {
    let config = new MatDialogConfig();
    config.disableClose = false;
    config.role = 'dialog';
    config.maxWidth = '100vw';
    config.maxHeight = '100vh';
    config.width = '850px';
    config.panelClass = 'full-screen-modal';
    config.data = { data: data };

    const dialogRef = this.dialog.open(AddEducationlevelComponent, config);

    dialogRef.afterClosed().subscribe(() => {
      this.getEducationLevels();
    });
  }
}
