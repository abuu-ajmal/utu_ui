import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {

    path:'',

    loadComponent:()=>import('./layout/main/main.component').then(c=>c.MainComponent),
    children:[
      {
        path:'',
        loadComponent:()=>import('./home/home.component').then(c=>c.HomeComponent)
      },

      {
        path:'registration',
        loadComponent:()=>import('./linkpage/registration/registration.component').then(c=>c.RegistrationComponent)
      },
      {
        path:'user-login',
        loadComponent:()=>import('./linkpage/user-login/user-login.component').then(c=>c.UserLoginComponent)
      },
      {
        path:'change-password',
        loadComponent:()=>import('./linkpage/change-password/change-password.component').then(c=>c.ChangePasswordComponent)
      }


    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalsRoutingModule { }
