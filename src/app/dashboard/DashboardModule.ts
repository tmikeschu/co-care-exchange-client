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
import { ConfirmMatchDialogComponent } from './components/confirm-new-match/confirm-new-match.component';
import { DashboardItemContainerComponent } from './containers/dashboard-item-container/dashboard-item-container.component';
import { ItemRequestComponent } from './components/item-request/item-request.component';
import { ItemShareComponent } from './components/item-share/item-share.component';
import { ItemPictureComponent } from './components/item-picture/item-picture.component';


@NgModule({
  declarations: [
    DashboardComponent,
    MetricsComponent,
    ConfirmMatchDialogComponent,
    DashboardItemContainerComponent,
    ItemRequestComponent,
    ItemShareComponent,
    ItemPictureComponent
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
