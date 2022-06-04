import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GfsCodeComponent} from './gfs-code.component';

const routes: Routes = [
  {
    path: '', component: GfsCodeComponent,
    data: {
      title: 'Income Source & Expense Codes', breadcrumb: 'Income Source & Expense Codes'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GfsCodeRoutingModule {
}
