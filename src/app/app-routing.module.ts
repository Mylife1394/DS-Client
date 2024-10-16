// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./pages/map/map.component').then((c) => c.default)
      },
      {
        path: 'dashboard/sensor-log',
        loadComponent: () => import('./pages/sensor-log/sensor-log.component')
      },
      {
        path: 'setting/groups',
        loadComponent: () => import('./setting/groups/groups.component')
      },
      {
        path: 'setting/users',
        loadComponent: () => import('./setting/users/users.component')
      },
      {
        path: 'setting/sensorTypes',
        loadComponent: () => import('./setting/sensor-type/sensor-type.component')
      },
      {
        path: 'setting/localizationString',
        loadComponent: () => import('./setting/localization-string/localization-string.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/ui-component/ui-color/ui-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/authentication/login/login.component')
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/authentication/register/register.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
