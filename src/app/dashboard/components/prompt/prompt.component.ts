import { Component, OnInit } from '@angular/core';
import { Prompt } from '../../../models/cce/prompt';
import { PromptService } from '../../../services/cce/prompt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
})
export class PromptComponent implements OnInit {
  prompts: Prompt[];
  surveyQuestions: Prompt[] = [];
  promptKeys: string[];
  promptTypeQuestion: string;

  promptMap;
  promptTypeIndex = 0;

  prompt: Prompt;
  promptIndex = 0;

  surveyTime = false;

  inNeed: boolean;

  constructor(private promptService: PromptService, private router: Router) {}

  ngOnInit() {
    this.promptMap = new Map();
    this.promptService.getPrompts().subscribe((val) => {
      this.buildPrompts(val);
    });
  }

  onPromptTypeNo() {
    this.inNeed = false;
    this.promptTypeIndex = this.promptTypeIndex + 1;

    if (this.promptTypeIndex < this.promptKeys.length) {
      this.getPromptTypeQuestion();
    } else {
      this.surveyTime = this.surveyQuestions.length > 0;
    }
  }

  onPromptTypeYes() {
    this.inNeed = true;
    this.prompts = this.promptMap.get(this.promptKeys[this.promptTypeIndex]);
    this.prompt = this.prompts[this.promptIndex];
  }

  getPromptTypeQuestion() {
    this.promptTypeQuestion =
      'Are you in need of ' + this.promptKeys[this.promptTypeIndex] + '?';
  }

  handleInNeed(inNeed) {
    if (inNeed === false) {
      // this will get the next prompt, could have a better name.
      this.onPromptTypeNo();
    }
    this.inNeed = inNeed;
  }

  handleSurveyFinished(surveyFinished) {
    // go to the next page here
    console.log('survey finished');
    this.router.navigate(['/summary']);
  }

  private buildPrompts(promptData: any) {
    promptData.data.prompts.forEach((val) => {
      // save the survey questions for last.
      if (val.promptType === 'Survey Questions') {
        this.surveyQuestions.push(val);
      } else {
        let prompts: Prompt[] = this.promptMap.get(val.promptType);

        if (!prompts) {
          prompts = [];
          prompts.push(val);
          this.promptMap.set(val.promptType, prompts);
        } else {
          prompts.push(val);
        }
      }
    });

    this.promptKeys = Array.from(this.promptMap.keys());
    this.getPromptTypeQuestion();
    console.log(this.promptMap);
    console.log(this.surveyQuestions);
  }
}
