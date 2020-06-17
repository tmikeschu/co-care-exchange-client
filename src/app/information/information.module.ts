import { NgModule } from '@angular/core';
import { IndividualComponent } from './individual/individual.component';
import { InformationComponent } from './information/information.component';
import { CustomMaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OrganizationComponent } from './organization/organization.component';
import { InformationRoutingModule } from './information-routing.module';
import { OrgInfoModalComponent } from './orginfomodal/orginfomodal.component';
import { PasswordResetComponent } from '../auth/components/password-reset/password-reset.component';
import { AuthModule } from '../auth/AuthModule';
import { PasswordChangeComponent } from '../auth/components/password-change/password-change.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FlexLayoutModule, CustomMaterialModule, FormsModule, InformationRoutingModule, AuthModule],
  declarations: [IndividualComponent, InformationComponent, OrganizationComponent, OrgInfoModalComponent],
  entryComponents: [OrgInfoModalComponent, PasswordChangeComponent]
})
export class InformationModule {}
