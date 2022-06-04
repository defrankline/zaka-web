import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountSubTypeService} from './account-sub-type.service';
import {AccountSubTypeListComponent} from './account-sub-type-list';
import {AccountSubTypeFormComponent} from './account-sub-type-form';
import {AccountSubTypeRoutingModule} from './account-sub-type-routing.module';
import {SharedModule} from '../../utils/shared.module';

@NgModule({
  declarations: [AccountSubTypeListComponent, AccountSubTypeFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    AccountSubTypeRoutingModule,
  ],
  providers: [AccountSubTypeService],
  entryComponents: []
})
export class AccountSubTypeModule {
}
