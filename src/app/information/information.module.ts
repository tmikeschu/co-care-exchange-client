import { NgModule } from '@angular/core';
import { IndividualComponent } from './individual/individual.component';
import { InformationComponent } from './information/information.component';
import { CustomMaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OrganizationComponent } from './organization/organization.component';
import { InformationRoutingModule } from './information-routing.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FlexLayoutModule, CustomMaterialModule, FormsModule, InformationRoutingModule],
  declarations: [IndividualComponent, InformationComponent, OrganizationComponent],
})
export class InformationModule {}
