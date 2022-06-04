import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from "./auth.component";

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    data: {breadcrumb: 'Authentication', title: 'Authentication'},
    children: [
      {
        path: '',
        loadChildren: () => import(`./login/login.module`).then(m => m.LoginModule),
        data: {title: 'Login', breadcrumb: 'Login', preload: false},
      },
      {
        path: 'login',
        loadChildren: () => import(`./login/login.module`).then(m => m.LoginModule),
        data: {title: 'Login', breadcrumb: 'Login', preload: false},
      },
    ],
    canActivate: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
