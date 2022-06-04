import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContributionSetupComponent } from './contribution-setup.component';
import {SharedModule} from '../../utils/shared.module';
import {ContributionSetupRoutingModule} from './contribution-setup-routing.module';
import { FormComponent } from './form/form.component';

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
