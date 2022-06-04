import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StrategyComponent} from './strategy.component';

const routes: Routes = [
  {
    path: '', component: StrategyComponent,
    data: {
      title: 'Strategies', breadcrumb: null
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StrategyRoutingModule {
}
