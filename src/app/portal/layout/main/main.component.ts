import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { PortalModule } from '../../portal.module';
import { PortalRoutingModule } from '../../portal-routing.module';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    PortalModule,
    HeaderComponent,
    PortalRoutingModule,
    FooterComponent,

],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
