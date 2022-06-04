import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlanningComponent} from './planning.component';
import {ProjectionFormComponent} from './projection/projection-form.component';


const routes: Routes = [
  {
    path: '', component: PlanningComponent,
    data: {
      title: 'Dashboard', breadcrumb: null
    }
  },
  {
    path: 'financial-year-plans',
    loadChildren: () => import('./plan/plan.module').then(m => m.PlanModule),
    data: {
      title: 'Financial Year Plans', breadcrumb: 'Financial Year Plans',
    },
  },
  {
    path: 'objectives',
    loadChildren: () => import('./objective/objective.module').then(m => m.ObjectiveModule),
    data: {
      title: 'Objectives', breadcrumb: 'Objectives',
    },
  },
  {
    path: 'targets',
    loadChildren: () => import('./target/target.module').then(m => m.TargetModule),
    data: {
      title: 'Targets', breadcrumb: 'Targets',
    },
  },
  {
    path: 'strategies',
    loadChildren: () => import('./strategy/strategy.module').then(m => m.StrategyModule),
    data: {
      title: 'Strategies', breadcrumb: 'Strategies',
    },
  },
  {
    path: 'activities',
    loadChildren: () => import('./activity/activity.module').then(m => m.ActivityModule),
    data: {
      title: 'Activities', breadcrumb: 'Activities',
    },
  },
  {
    path: 'fund-sources',
    loadChildren: () => import('./fund-source/fund-source.module').then(m => m.FundSourceModule),
    data: {
      title: 'Fund Sources', breadcrumb: 'Fund Sources',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningRoutingModule {
}
