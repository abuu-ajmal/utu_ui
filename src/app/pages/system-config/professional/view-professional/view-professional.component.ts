import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { Router } from 'express';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from '../../../../services/authentication/permission.service';

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
import Swal from 'sweetalert2';
import { ProfessionalService } from '../../../../services/system-configuration/professional.service';
import { AddProfessionalComponent } from '../add-professional/add-professional.component';

@Component({
  selector: 'app-view-professional',
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
    EmrSegmentedModule
  ],
  templateUrl: './view-professional.component.html',
  styleUrl: './view-professional.component.scss'
})
export class ViewProfessionalComponent implements OnInit,OnDestroy{
  private readonly onDestroy = new Subject<void>()

  displayedColumns: string[] = ['id','title','action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(public permission: PermissionService,
    public proServices: ProfessionalService,
    private route:Router,
    private dialog: MatDialog
    ){}

  ngOnInit(): void {
    this.getProfessional();
  }
  ngOnDestroy(): void {
    this.onDestroy.next()
  }
  renew(){
    this.getProfessional();
  }

  getProfessional() {
    this.proServices.getAllProfessional().pipe(takeUntil(this.onDestroy)).subscribe((response: any)=>{
      if(response.statusCode==200){
        this.dataSource = new MatTableDataSource(response.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }if(response.statusCode==401){
        this.route.navigateByUrl("/")
        console.log(response.message)
      }
    },(error)=>{
      this.route.navigateByUrl("/")
      console.log('country getAway api fail to load')
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addProfessional() {
    let config = new MatDialogConfig()
    config.disableClose = false
    config.role = 'dialog'
    config.maxWidth ='100vw'
    config.maxHeight = '100vh'
    config.width = '850px'
    config.panelClass = 'full-screen-modal'

    const dialogRef = this.dialog.open(AddProfessionalComponent,config);

    dialogRef.afterClosed().subscribe(result => {
      this.getProfessional();
    });
  }

  updateProfessional(data: any) {
    let config = new MatDialogConfig()
    config.disableClose = false
    config.role = 'dialog'
    config.maxWidth ='100vw'
    config.maxHeight = '100vh'
    config.width = '850px'
    config.panelClass = 'full-screen-modal'
    config.data = {data: data}
    console.log("hiiiii",config.data)

  

    const dialogRef = this.dialog.open(AddProfessionalComponent,config);

    dialogRef.afterClosed().subscribe(result => {
      this.getProfessional();
    });
  }





}
