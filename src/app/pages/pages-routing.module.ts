import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../services/authentication/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./common/common.component').then(c => c.CommonComponent),
    canActivate: [AuthGuard],
    children: [

      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'users/permission',
        loadChildren: () => import('./users/permission/permission.module').then(m => m.PermissionModule)
      },
      {
        path: 'users/role-permission',
        loadChildren: () => import('./users/role-permission/role-permission.module').then(m => m.RolePermissionModule)
      },
      {
        path: 'config/country',
        loadChildren: () => import('./system-config/country/country.module').then(m => m.CountryModule)
      },
      {
        path: 'config',
        loadChildren: () => import('./system-config/system-config-routing.module').then(m => m.SystemConfigRoutingModule)
      },
      {
        path:'identity',
        loadComponent:() => import('./identity/viewidentity/viewidentity.component').then(c=>c.ViewidentityComponent)

      },
      {
        path:'proff',
        loadComponent:()=> import('./proff/viewproff/viewproff.component').then(c=>c.ViewproffComponent)
      },
      {
        path:'proservices',
        loadComponent:() => import('./proservices/viewproservices/viewproservices.component').then(c=>c.ViewproservicesComponent)

      },
      {
        path:'slots',
        loadComponent:()=> import('./slots/viewslots/viewslots.component').then(c=>c.ViewslotsComponent)

      },
      {
        path:'setslots',
        loadComponent:()=>import('./slots/setslots/setslots.component').then(c=>c.SetslotsComponent)

      },


{
  path:'users/manageuser',
  loadChildren: () => import('./users/manageuser/manageuser.module').then(m =>m.ManageuserModule)

},


      {
        path: 'user-profile',
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule)
      },

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
