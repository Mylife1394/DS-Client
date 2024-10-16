// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { authGuard } from './auth/auth.guard';
import LoginComponent from './demo/authentication/login/login.component';

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
        loadComponent: () => import('./pages/map/map.component').then((c) => c.default),
        canActivate: [authGuard]
      },
      {
        path: 'dashboard/sensor-log',
        loadComponent: () => import('./pages/sensor-log/sensor-log.component'),
        canActivate: [authGuard]
      },
      {
        path: 'setting/groups',
        loadComponent: () => import('./setting/groups/groups.component'),
        canActivate: [authGuard]
      },
      {
        path: 'setting/users',
        loadComponent: () => import('./setting/users/users.component'),
        canActivate: [authGuard]
      },
      {
        path: 'setting/sensorTypes',
        loadComponent: () => import('./setting/sensor-type/sensor-type.component'),
        canActivate: [authGuard]
      },
      {
        path: 'setting/localizationString',
        loadComponent: () => import('./setting/localization-string/localization-string.component'),
        canActivate: [authGuard]
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/ui-component/ui-color/ui-color.component'),
        canActivate: [authGuard]
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component'),
        canActivate: [authGuard]
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
export class AppRoutingModule { }
