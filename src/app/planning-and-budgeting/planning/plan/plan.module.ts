import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlanComponent} from './plan.component';
import {FormComponent} from './form/form.component';
import {PlanRoutingModule} from './plan-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {CopyComponent} from './copy/copy.component';
import {ObjectiveModule} from './objective/objective.module';
import {ViewComponent} from './view/view.component';
import {ApproveComponent} from './approve/approve.component';
import {CommentHistoryComponent} from './comment-history/comment-history.component';
import {CommitteeDocumentComponent} from './committee-document/committee-document.component';
import {RegistrarDocumentComponent} from './registrar-document/registrar-document.component';
import {ResponseComponent} from './response/response.component';

@NgModule({
  declarations: [PlanComponent, FormComponent, CopyComponent, ResponseComponent,
    CommentHistoryComponent, RegistrarDocumentComponent,
    CommitteeDocumentComponent, ViewComponent, ApproveComponent],
  imports: [
    CommonModule,
    PlanRoutingModule,
    SharedModule,
    ObjectiveModule
  ]
})
export class PlanModule {
}
