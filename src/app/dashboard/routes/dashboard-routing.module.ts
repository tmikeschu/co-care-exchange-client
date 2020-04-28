import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../components/dashboard.component';
import { MetricsComponent } from '../components/metrics/metrics.component';
import { AgreementDetailComponent } from '../components/agreement-detail/agreement-detail.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { DASHBOARD_ROUTE } from '../../core/constants/routes';

export const routes: Routes = [
  {
    path: DASHBOARD_ROUTE,
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'metrics',
    component: MetricsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'agreement-detail',
    component: AgreementDetailComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
