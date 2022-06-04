import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainLayoutComponent} from './layout/main-layout/main-layout.component';
import {AuthGuard} from './auth/auth.guard';
import {CustomPreloadingStrategyService} from './shared/custom-preloading';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import(`./landing-page/landing-page.module`).then(m => m.LandingPageModule),
    data: {
      preload: true
    },
  },
  {
    path: 'site',
    loadChildren: () => import(`./landing-page/landing-page.module`).then(m => m.LandingPageModule),
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    data: {
      breadcrumb: 'Dashboard',
      title: 'Dashboard',
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'parishioner-management',
        loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/setup-management.module').then(m => m.SetupManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'income-and-expenditure',
        loadChildren: () => import('./income-and-expenditure/income-and-expenditure.module').then(m => m.IncomeAndExpenditureModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'report',
        loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'notifications',
        loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule),
        canActivate: [AuthGuard],
        data: {title: 'Notification'}
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import(`./auth/auth.module`).then(m => m.AuthModule),
    data: {
      title: 'Authentication', breadcrumb: 'Authentication',
    },
  },
  {
    path: '**',
    redirectTo: 'site',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, preloadingStrategy: CustomPreloadingStrategyService})],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
