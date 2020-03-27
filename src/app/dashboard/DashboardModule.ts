import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFooterComponent } from './components/dashboard-footer/dashboard-footer.component';
import { DashboardComponent } from './components/dashboard.component';
import { StatusDialogComponent } from './components/status-dialog/status-dialog.component';
import { CustomMaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { MetricsComponent } from './components/metrics/metrics.component';
import { DashboardRoutingModule } from './routes/dashboard-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardFooterComponent,
    MetricsComponent,
    StatusDialogComponent,
  ],
  imports: [
    CommonModule,
    CustomMaterialModule,
    DashboardRoutingModule,
    SharedModule,
  ],
  entryComponents: [StatusDialogComponent],
})
export class DashboardModule {}
