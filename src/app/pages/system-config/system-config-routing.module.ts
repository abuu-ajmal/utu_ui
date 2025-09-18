import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {

    path: 'location',
    title: 'Location',
    loadComponent: () => import('./locations/location/location.component').then(c => c.LocationComponent)
  },
  {
    path: 'country',
    title: 'Country',
    loadComponent: () => import('./country/country-board/country-board.component').then(c => c.CountryBoardComponent)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemConfigRoutingModule { }
