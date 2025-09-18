import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    loadComponent:() => import('./manageuser/manageuser.component').then(c=>c.ManageuserComponent)
  },
  {
    path:'adduser',
    loadComponent:()=> import('./adduser/adduser.component').then(c=>c.AdduserComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageuserRoutingModule { }
