import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountTypeRoutingModule} from './account-type-routing.module';
import {AccountTypeListComponent} from './account-type-list/account-type-list.component';
import {AccountTypeFormComponent} from './account-type-form/account-type-form.component';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
    declarations: [AccountTypeListComponent, AccountTypeFormComponent],
    imports: [
        CommonModule,
        SharedModule,
        AccountTypeRoutingModule,
    ],
    providers: []
})
export class AccountTypeModule {
}
