import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountTypeListComponent} from './account-type-list/account-type-list.component';

const routes: Routes = [
  {
    path: '', component: AccountTypeListComponent,
    data: {title: 'Ledger Account Types'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountTypeRoutingModule {
}
