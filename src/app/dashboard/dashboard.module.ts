import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {NgxPermissionsRestrictStubModule} from 'ngx-permissions';
import {TranslateModule} from '@ngx-translate/core';
import {MyShareComponent} from './my-share/my-share.component';
import {MySavingComponent} from './my-saving/my-saving.component';
import {MyDepositComponent} from './my-deposit/my-deposit.component';
import {MyLoanComponent} from './my-loan/my-loan.component';
import {PortalModule} from '../portal/portal.module';

@NgModule({
  declarations: [DashboardComponent, MyShareComponent, MySavingComponent, MyDepositComponent,
    MyLoanComponent],
  imports: [CommonModule, SharedModule, DashboardRoutingModule, NgxPermissionsRestrictStubModule,
    TranslateModule, PortalModule]
})
export class DashboardModule {
}
