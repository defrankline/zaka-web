import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountService} from './account.service';
import {AccountFormComponent} from './account-form/account-form.component';
import {AccountRoutingModule} from './account-routing.module';
import {AccountListComponent} from './account-list/account-list.component';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [AccountFormComponent, AccountListComponent],
  imports: [
    CommonModule,
    SharedModule,
    AccountRoutingModule
  ],
  providers: [AccountService],
  entryComponents: [AccountFormComponent]
})
export class AccountModule {
}
