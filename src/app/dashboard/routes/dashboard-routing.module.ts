import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../components/dashboard.component';
import { MetricsComponent } from '../components/metrics/metrics.component';
import { AnswerDetailComponent } from '../components/answer-detail/answer-detail.component';
import {UserResolver} from '../../core/resolvers/user.resolver';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: { user: UserResolver },
  },
  {
    path: 'metrics',
    component: MetricsComponent,
    resolve: { user: UserResolver},
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
