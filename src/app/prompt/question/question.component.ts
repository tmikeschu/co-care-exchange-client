import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PromptComponent} from '../prompt.component';
import {Prompt} from '../../models/cce/prompt';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnChanges {

  @Input()
  prompts: Prompt[];

  prompt: Prompt;

  @Output()
  promptInNeed = new EventEmitter();

  @Output()
  surveyFinished = new EventEmitter();


  @Input()
  survey = false;

  inNeed = false;

  promptIndex = 0;

  constructor() {

  }

  ngOnInit() {

  }

  onPromptYes() {
    if (!this.survey) {
      this.inNeed = true;
    } else {
      // service to send the survey response to the server
      this.nextQuestion('next');
    }
  }

  nextQuestion(val: string) {
    if (val === 'next') {
      // this handles going to the next question.
      this.onPromptNo(true);
    } else if (val === 'same') {
      this.onPromptNo(false);
    }
  }

  onPromptNo(next: boolean) {
    this.inNeed = false;

    if (next) {
      this.promptIndex = this.promptIndex + 1;
    }
    if (this.promptIndex < this.prompts.length) {
      this.prompt = this.prompts[this.promptIndex];
    } else if (this.survey) {
      this.surveyFinished.emit(true);
    } else {
      this.promptInNeed.emit(false);
      this.promptIndex = 0;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.prompts = changes.prompts.currentValue;
    this.prompt = this.prompts[0];
    this.promptIndex = 0;
  }

}
