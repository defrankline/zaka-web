import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlanningComponent} from './planning.component';
import {PlanningRoutingModule} from './planning-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {ProjectionFormComponent} from './projection/projection-form.component';

@NgModule({
  declarations: [PlanningComponent, ProjectionFormComponent],
  imports: [
    CommonModule,
    PlanningRoutingModule,
    SharedModule
  ]
})
export class PlanningModule {
}
