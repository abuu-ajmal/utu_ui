import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    loadComponent: () => import('./layout/main/main.component').then(c => c.MainComponent ),
    children:[
      {
        path: '',
        loadComponent: () => import('./home/home.component').then(c => c.HomeComponent ),
      },
      {
        path: 'suggestion',
        loadComponent: () => import('./registerform/suggestion/suggestion.component').then(c => c.SuggestionComponent ),
      },
      {
        path: 'complain',
        loadComponent: () => import('./registerform/complain/complain.component').then(c => c.ComplainComponent),
      },
     {
      path:'contact',
      loadComponent: () => import('./registerform/contact/contact.component'). then(c =>c.ContactComponent)
     }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
