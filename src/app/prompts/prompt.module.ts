import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptsIndividualQuestionComponent } from './prompts-individual/prompts-individual-question/prompts-individual-question.component';
import { PromptsIndividualAnswerComponent } from './prompts-individual/prompts-individual-answer/prompts-individual-answer.component';
import { PromptsIndividualComponent } from './prompts-individual/prompts-individual.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomMaterialModule } from '../material/material.module';
import { PromptsOrganizationComponent } from './prompts-organization/prompts-organization.component';
import { PromptsOrganizationSummaryComponent } from './prompts-organization/prompts-organization-summary/prompts-organization-summary.component';
import { PromptsOrganizationQuestionComponent } from './prompts-organization/prompts-organization-question/prompts-organization-question.component';
import { PromptsOrganizationAnswerComponent } from './prompts-organization/prompts-organization-answer/prompts-organization-answer.component';
import { PromptsIndividualSummaryComponent } from './prompts-individual/prompts-individual-summary/prompts-individual-summary.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FlexLayoutModule, CustomMaterialModule, FormsModule],
  declarations: [
    PromptsIndividualComponent,
    PromptsIndividualQuestionComponent,
    PromptsIndividualSummaryComponent,
    PromptsIndividualAnswerComponent,
    PromptsOrganizationComponent,
    PromptsOrganizationSummaryComponent,
    PromptsOrganizationQuestionComponent,
    PromptsOrganizationAnswerComponent,
  ],
})
export class PromptModule {}
