import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard.component';
import { StatusDialogComponent } from './components/status-dialog/status-dialog.component';
import { CustomMaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { MetricsComponent } from './components/metrics/metrics.component';
import { DashboardRoutingModule } from './routes/dashboard-routing.module';
import { PromptsRoutingModule } from '../prompts/prompts-routing.module';
import { AnswerDetailComponent } from './components/answer-detail/answer-detail.component';


@NgModule({
  declarations: [
    DashboardComponent,
    MetricsComponent,
    StatusDialogComponent,
    AnswerDetailComponent
  ],
  imports: [
    CommonModule,
    CustomMaterialModule,
    DashboardRoutingModule,
    PromptsRoutingModule,
    SharedModule,
    FlexLayoutModule
  ],
  entryComponents: [StatusDialogComponent],
})
export class DashboardModule {}
