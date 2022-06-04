import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SetupManagementComponent} from './setup-management.component';
import {AuthGuard} from "../auth/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: SetupManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tiles',
    loadChildren: () => import('./tile/tile.module').then(m => m.TileModule),
    data: {title: 'Tiles'},
    canActivate: [AuthGuard]
  },
  {
    path: 'reminder-categories',
    loadChildren: () => import('./reminder-category/reminder-category.module').then(m => m.ReminderCategoryModule),
    data: {title: 'SMS Categories'},
    canActivate: [AuthGuard]
  },
  {
    path: 'hierarchies',
    loadChildren: () => import('./division/division.module').then(m => m.DivisionModule),
    data: {title: 'Administrative Hierarchies'},
    canActivate: [AuthGuard]
  },
  {
    path: 'hierarchy-levels',
    loadChildren: () => import('./level/level.module').then(m => m.LevelModule),
    data: {title: 'Administrative Hierarchy Levels'},
    canActivate: [AuthGuard]
  },
  {
    path: 'fund-sources-and-expense-codes',
    loadChildren: () => import('./gfs-code/gfs-code.module').then(m => m.GfsCodeModule),
    data: {
      title: 'Fund Sources & Expense Codes', breadcrumb: 'Fund Sources & Expense Codes',
    },
  },
  {
    path: 'payment-methods',
    loadChildren: () => import('./payment-method/payment-method.module').then(m => m.PaymentMethodModule),
    data: {title: 'Payment Method'},
    canActivate: [AuthGuard]
  },
  {
    path: 'ledger-accounts',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
    data: {title: 'Ledger Accounts'},
    canActivate: [AuthGuard]
  },
  {
    path: 'ledger-account-groups',
    loadChildren: () => import('./account-group/account-group.module').then(m => m.AccountGroupModule),
    data: {title: 'Ledger Account Groups'},
    canActivate: [AuthGuard]
  },
  {
    path: 'ledger-account-sub-types',
    loadChildren: () => import('./account-sub-type/account-sub-type.module').then(m => m.AccountSubTypeModule),
    data: {title: 'Ledger Account Sub-types'},
    canActivate: [AuthGuard]
  },
  {
    path: 'ledger-account-types',
    loadChildren: () => import('./account-type/account-type.module').then(m => m.AccountTypeModule),
    data: {title: 'Ledger Account Types'},
    canActivate: [AuthGuard]
  },
  {
    path: 'liturgical-years',
    loadChildren: () => import('./liturgical-year/liturgical-year.module').then(m => m.LiturgicalYearModule),
    data: {title: 'Liturgical Years'},
    canActivate: [AuthGuard]
  },
  {
    path: 'contribution-setup',
    loadChildren: () => import('./contribution-setup/contribution-setup.module').then(m => m.ContributionSetupModule),
    data: {title: 'Contribution Setup'},
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupManagementRoutingModule {
}
