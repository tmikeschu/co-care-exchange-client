import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFooterComponent } from './components/dashboard-footer/dashboard-footer.component';
import { DashboardComponent } from './components/dashboard.component';
import { StatusDialogComponent } from './components/status-dialog/status-dialog.component';
import { CustomMaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardFooterComponent,
    StatusDialogComponent,
  ],
  imports: [CommonModule, CustomMaterialModule, SharedModule],
  entryComponents: [StatusDialogComponent],
})
export class DashboardModule {}
