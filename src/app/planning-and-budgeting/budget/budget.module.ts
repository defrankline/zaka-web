import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListComponent} from './list/list.component';
import {FormComponent} from './form/form.component';
import {SharedModule} from '../../shared/shared.module';
import {NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import {CommitteeDocumentComponent} from './committee-document/committee-document.component';
import {RegistrarDocumentComponent} from './registrar-document/registrar-document.component';
import {ResponseComponent} from './response/response.component';
import {CommentHistoryComponent} from './comment-history/comment-history.component';
import {ApproveComponent} from './approve/approve.component';
import {BudgetingRoutingModule} from './budgeting-routing.module';
import {UploadComponent} from './upload/upload.component';
import {BreakdownModule} from './breakdown/breakdown.module';
import {ActualComponent} from './actual/actual.component';

@NgModule({
  declarations: [ListComponent, FormComponent, CommitteeDocumentComponent,
    RegistrarDocumentComponent,
    ResponseComponent, CommentHistoryComponent, ApproveComponent, UploadComponent, ActualComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbPopoverModule,
    BudgetingRoutingModule,
    BreakdownModule
  ],
  entryComponents: []
})
export class BudgetModule {
}
