import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Prompt } from '../../../../models/cce/prompt';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnswerService } from '../../../../services/cce/answer.service';
import { AnswerModel } from '../../../../models/cce/answer-model';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss'],
})
export class AnswerComponent implements OnInit, OnChanges {
  answerForm: FormGroup;

  @Input()
  prompt: Prompt;

  question: string;

  requesting = 0;
  sharing = 0;

  unitsOfIssueChoices: string[] = [];

  unitsOfIssue: string;

  @Output()
  nextQuestion = new EventEmitter();

  constructor(
    private answerService: AnswerService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.answerForm = this.formBuilder.group({
      requesting: [0, Validators.required],
      sharing: [0, Validators.required],
    });
    this.getQuestion();
  }

  onSubmit() {
    // some service write the response to the backend
    // get the number of items negative number for request positive for sharing.
    let numberValue = 0;
    if (this.requesting > 0) {
      numberValue = this.requesting * -1;
    } else if (this.sharing > 0) {
      numberValue = this.sharing;
    }

    const answer: AnswerModel = {
      promptId: this.prompt.id,
      clientMutationId: '123456',
      numberValue: numberValue,
      unitOfIssue: this.unitsOfIssue,
      userId: '22201103-DEC0-466F-B44F-1926BC1687C1',
    };

    this.answerService.postAnswer(answer).subscribe((val) => {
      // go to the next question
      this.nextQuestion.emit('next');
    });
  }

  onCancel() {
    this.nextQuestion.emit('same');
  }

  handleRequesting(direction) {
    switch (direction) {
      case 'up':
        this.requesting += 1;
        this.sharing = 0;
        break;
      case 'down':
        this.requesting = this.requesting > 0 ? this.requesting - 1 : 0;
        break;
      default:
        this.requesting = 0;
    }
  }

  handleSharing(direction) {
    switch (direction) {
      case 'up':
        this.sharing += 1;
        this.requesting = 0;
        break;
      case 'down':
        this.sharing = this.sharing > 0 ? this.sharing - 1 : 0;
        break;
      default:
        this.sharing = 0;
    }
  }

  getQuestion() {
    this.question =
      'How many ' + this.prompt.item + 's  are you requesting or sharing?';
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.prompt = changes.prompt.currentValue;
    if (this.prompt.unitsOfIssue && this.prompt.unitsOfIssue.length > 0) {
      const parts = this.prompt.unitsOfIssue.split(',');
      if (parts.length > 1) {
        this.unitsOfIssueChoices = parts;
        this.unitsOfIssue = this.unitsOfIssueChoices[0];
      }
    }
  }
}
