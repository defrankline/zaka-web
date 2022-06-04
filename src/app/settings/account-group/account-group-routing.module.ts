import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountGroupListComponent} from './account-group-list/account-group-list.component';

const routes: Routes = [
  {
    path: '', component: AccountGroupListComponent,
    data: {title: 'Account Groups'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountGroupRoutingModule {
}
