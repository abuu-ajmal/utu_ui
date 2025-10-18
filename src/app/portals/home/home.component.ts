
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,


  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


 constructor(private router: Router, private dialog: MatDialog) {}

  getRegistration() {
    // ✅ Use relative path so it stays inside layout
    this.router.navigate(['home/registration']);
  }

   getLogin() {
    // ✅ Use relative path so it stays inside layout
    this.router.navigate(['home/user-login']);
  }
}
