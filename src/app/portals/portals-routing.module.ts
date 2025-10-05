import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    title:'portal',
    loadComponent:()=>import('./layout/main/main.component').then(c=>c.MainComponent),
    children:[
      {
        path:'',
        loadComponent:()=>import('./home/home.component').then(c=>c.HomeComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalsRoutingModule { }
