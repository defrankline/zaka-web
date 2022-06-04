import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContributionSetupComponent } from './contribution-setup.component';
import {ContributionSetupRoutingModule} from './contribution-setup-routing.module';
import { FormComponent } from './form/form.component';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    ContributionSetupComponent,
    FormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ContributionSetupRoutingModule
  ]
})
export class ContributionSetupModule { }
