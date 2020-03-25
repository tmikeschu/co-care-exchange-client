import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionComponent } from './question/question.component';
import { AnswerComponent } from './answer/answer.component';
import { PromptComponent } from './prompt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomMaterialModule } from '../material/material.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FlexLayoutModule, CustomMaterialModule, FormsModule],
  declarations: [PromptComponent, QuestionComponent, AnswerComponent],
})
export class PromptModule {}
