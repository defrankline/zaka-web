import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContributionRoutingModule } from './contribution-routing.module';
import { ContributionComponent } from './contribution.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    ContributionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ContributionRoutingModule
  ]
})
export class ContributionModule { }
