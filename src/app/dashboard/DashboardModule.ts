import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard.component';
import { CustomMaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { MetricsComponent } from './components/metrics/metrics.component';
import { DashboardRoutingModule } from './routes/dashboard-routing.module';
import { PromptsRoutingModule } from '../prompts/prompts-routing.module';
import { AgreementDetailComponent } from './components/agreement-detail/agreement-detail.component';
import { ConfirmMatchDialogComponent } from './components/confirm-new-match/confirm-new-match.component';


@NgModule({
  declarations: [
    DashboardComponent,
    MetricsComponent,
    ConfirmMatchDialogComponent,
    AgreementDetailComponent
  ],
  imports: [
    CommonModule,
    CustomMaterialModule,
    DashboardRoutingModule,
    PromptsRoutingModule,
    SharedModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [ConfirmMatchDialogComponent],
})
export class DashboardModule {}
