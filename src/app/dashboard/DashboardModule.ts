import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard.component';
import { StatusDialogComponent } from './components/status-dialog/status-dialog.component';
import { CustomMaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { MetricsComponent } from './components/metrics/metrics.component';
import { DashboardRoutingModule } from './routes/dashboard-routing.module';
import { SummaryComponent } from './components/prompt/summary/summary.component';
import { PromptModule } from './components/prompt/prompt.module';

@NgModule({
  declarations: [
    DashboardComponent,
    MetricsComponent,
    StatusDialogComponent,
    SummaryComponent,
  ],
  imports: [
    CommonModule,
    CustomMaterialModule,
    PromptModule,
    DashboardRoutingModule,
    SharedModule,
  ],
  entryComponents: [StatusDialogComponent],
})
export class DashboardModule {}
