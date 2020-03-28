import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../components/dashboard.component';
import { PromptComponent } from '../components/prompt/prompt.component';
import { SummaryComponent } from '../components/prompt/summary/summary.component';
import { MetricsComponent } from '../components/metrics/metrics.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: DashboardComponent,
  // },
  {
    path: 'prompt',
    component: PromptComponent,
  },
  {
    path: 'summary',
    component: SummaryComponent,
  },
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent
  // },
  {
    path: 'metrics',
    component: MetricsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
