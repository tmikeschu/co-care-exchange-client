import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './components/register/register.component';
import { CustomMaterialModule } from '../../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    FlexLayoutModule,
    RouterModule
  ],
})
export class RegistrationModule {}
