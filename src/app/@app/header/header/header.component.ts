import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatBadge } from '@angular/material/badge';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { EmrAvatarModule, IconComponent, SoundEffectDirective } from '@elementar/components';
import { NotificationListComponent } from '@app/header/_notifications/notification-list/notification-list.component';
import { EmrPopoverModule } from '@elementar/components';
import { AssistantSearchComponent } from '@app/header/_assistant-search/assistant-search.component';
import { ThemeManagerService } from '@elementar/components';
import { LayoutApiService } from '@elementar/components';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    AsyncPipe,
    MatFormField,
    MatInput,
    MatPrefix,
    MatBadge,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    EmrAvatarModule,
    MatDivider,
    MatButton,
    MatTooltip,
    NotificationListComponent,
    EmrPopoverModule,
    RouterLink,
    AssistantSearchComponent,
    IconComponent,
    MatAnchor,
    SoundEffectDirective
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    'class': 'block w-full h-full'
  }
})
export class HeaderComponent implements OnInit{
  protected _themeManager = inject(ThemeManagerService);
  private _layoutApi = inject(LayoutApiService);
  isDark = this._themeManager.isDark();

  @Input()
  sidebarHidden = false;

  toggleSidebar(): void {
    if (!this.sidebarHidden) {
      this._layoutApi.hideSidebar('root');
    } else {
      this._layoutApi.showSidebar('root');
    }

    this.sidebarHidden = !this.sidebarHidden;
  }

  constructor(private route:Router,){}

  fullName:any;
  emails:any;

  ngOnInit(): void {
    this.fullName = localStorage.getItem('full_name');
    this.emails = localStorage.getItem('email');
  }

  logoutHead(){
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout in this system",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
      allowOutsideClick: () => !Swal.isVisible()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Congratulation!!!!",
          text: "You have a succeessfully to logout",
          icon: "success",
          allowOutsideClick: () => !Swal.isVisible()
        }).then(() => {
          localStorage.clear();
          this.route.navigate(['/']);
        });
      }
    });
  }
}
