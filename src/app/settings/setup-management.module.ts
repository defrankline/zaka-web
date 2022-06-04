import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetupManagementComponent} from './setup-management.component';
import {SetupManagementRoutingModule} from './setup-management-routing.module';

@NgModule({
  declarations: [
    SetupManagementComponent
  ],
  imports: [
    CommonModule,
    SetupManagementRoutingModule
  ]
})
export class SetupManagementModule {
}
