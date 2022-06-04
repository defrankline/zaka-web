import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GfsCodeComponent} from './gfs-code.component';
import {GfsCodeRoutingModule} from './gfs-code-routing.module';
import { FormComponent } from './form/form.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [GfsCodeComponent, FormComponent],
  imports: [
    CommonModule,
    SharedModule,
    GfsCodeRoutingModule
  ]
})
export class GfsCodeModule {
}
