import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountGroupRoutingModule} from './account-group-routing.module';
import {AccountGroupFormComponent} from './account-group-form/account-group-form.component';
import {AccountGroupListComponent} from './account-group-list/account-group-list.component';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [AccountGroupFormComponent, AccountGroupListComponent],
  imports: [
    CommonModule,
    SharedModule,
    AccountGroupRoutingModule,
  ],
  entryComponents: []
})
export class AccountGroupModule {
}
