import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomMaterialModule } from '../material/material.module';
import { PantryLocatorComponent } from './pantry-locator.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FlexLayoutModule, CustomMaterialModule, FormsModule],
  declarations: [PantryLocatorComponent],
})
export class PantryLocatorModule {
  requesting = 0;
  sharing = 0;
}
