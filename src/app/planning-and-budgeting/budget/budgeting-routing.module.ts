import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListComponent as BudgetComponent} from './list/list.component';
import {FormComponent} from './form/form.component';
import {UploadComponent} from './upload/upload.component';
import {BreakdownComponent} from './breakdown/breakdown.component';
import {ActualComponent} from './actual/actual.component';

const routes: Routes = [
  {
    path: '', component: BudgetComponent,
    data: {
      title: 'Dashboard', breadcrumb: null
    }
  },
  {
    path: 'create', component: FormComponent,
    data: {
      title: 'Create', breadcrumb: 'Create'
    }
  },
  {
    path: 'upload', component: UploadComponent,
    data: {
      title: 'Upload', breadcrumb: 'Upload'
    }
  },
  {
    path: 'edit/:id', component: FormComponent,
    data: {
      title: 'Update', breadcrumb: 'Update'
    }
  },
  {
    path: 'breakdown/:id', component: BreakdownComponent,
    data: {
      title: 'Breakdown', breadcrumb: 'Breakdown'
    }
  },
  {
    path: 'actual/:id', component: ActualComponent,
    data: {
      title: 'Actual', breadcrumb: 'Actual'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetingRoutingModule {
}
