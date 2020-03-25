import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';


import { GreetingComponent } from './greeting/greeting.component';
import {CustomMaterialModule} from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CustomMaterialModule,
    FlexLayoutModule
  ],
  declarations: [
    GreetingComponent,
  ],
  exports: [
    GreetingComponent,
  ],
})
export class SharedModule {
}
