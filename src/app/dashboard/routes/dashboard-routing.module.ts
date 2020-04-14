import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../components/dashboard.component';
import { MetricsComponent } from '../components/metrics/metrics.component';
import { AgreementDetailComponent } from '../components/agreement-detail/agreement-detail.component';
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
    path: 'agreement-detail',
    component: AgreementDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
