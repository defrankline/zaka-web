import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountListComponent} from './account-list/account-list.component';

const routes: Routes = [
  {
    path: '', component: AccountListComponent, data: {
      title: 'Accounts', breadcrumb: null
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
