import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlanningAndBudgetingComponent} from './planning-and-budgeting.component';


const routes: Routes = [
  {
    path: '', component: PlanningAndBudgetingComponent,
    data: {
      title: 'Dashboard', breadcrumb: null
    }
  },
  {
    path: 'planning',
    loadChildren: () => import('./planning/planning.module').then(m => m.PlanningModule),
    data: {title: 'Planning', breadcrumb: 'Planning'},
  },
  {
    path: 'budgets',
    loadChildren: () => import('./budget/budget.module').then(m => m.BudgetModule),
    data: {title: 'Budgets', breadcrumb: 'Budgets'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningAndBudgetingRoutingModule {
}
