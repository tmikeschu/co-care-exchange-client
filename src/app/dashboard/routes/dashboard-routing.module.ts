import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../components/dashboard.component';
import { MetricsComponent } from '../components/metrics/metrics.component';
import { AnswerDetailComponent } from '../components/answer-detail/answer-detail.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: DashboardComponent,
  // },
  // {
  //   path: 'promptind',
  //   component: PromptsIndividualComponent,
  // },
  // {
  //   path: 'promptorg',
  //   component: PromptsOrganizationComponent,
  // },
  // {
  //   path: 'summary',
  //   component: SummaryComponent,
  // },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'metrics',
    component: MetricsComponent,
  },
  {
    path: 'answer-detail',
    component: AnswerDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
