import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotificationComponent} from './notification.component';
import {NotificationRoutingModule} from './notification-routing.module';
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [
    NotificationComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NotificationRoutingModule
  ]
})
export class NotificationModule {
}
