import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountSubTypeListComponent} from './account-sub-type-list';

const routes: Routes = [
  {
    path: '', component: AccountSubTypeListComponent,
    data: {title: 'Ledger Account Sub-types'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountSubTypeRoutingModule {
}
