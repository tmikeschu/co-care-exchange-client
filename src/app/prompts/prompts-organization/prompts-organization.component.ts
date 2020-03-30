import { Component, OnInit } from '@angular/core';
import { Prompt } from 'src/app/models/cce/prompt';
import { PromptService } from 'src/app/services/cce/prompt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prompts-organization',
  templateUrl: './prompts-organization.component.html',
  styleUrls: ['./prompts-organization.component.scss']
})
export class PromptsOrganizationComponent implements OnInit {
  prompts: Prompt[];
  surveyQuestions: Prompt[] = [];
  promptKeys: string[];
  promptTypeQuestion: string;

  promptMap: any = new Map();
  promptTypeIndex = 0;

  prompt: Prompt;
  promptIndex = 0;

  surveyTime = false;
  
  inNeed: boolean;

  constructor(private promptService: PromptService, private router: Router) {}

  ngOnInit() {
    //TODO: get the grouptype from the logged in user type
    this.promptService.getPrompts('org').subscribe((val) => {
      console.log('ngOnInit', val);
      this.prompts = val.data.prompts;

      for(let x = 0; x < val.data.prompts.length; x++){
        this.prompts[x].unitsOfIssueChoices = val.data.prompts[x].unitsOfIssue.split(', ');
        this.prompts[x].unitsOfIssue = this.prompts[x].unitsOfIssueChoices[0];
        this.prompts[x].sharing = 0;
        this.prompts[x].requesting = 0;
      }     
      
    });    
  }

  handleRequesting(question, direction) {
    switch (direction) {
      case 'up':
        question.requesting += 1;
        question.sharing = 0;
        break;
      case 'down':
        question.requesting = question.requesting > 0 ? question.requesting - 1 : 0;
        break;
      default:
        question.requesting = 0;
    }
  }

  handleSharing(question, direction) {
    switch (direction) {
      case 'up':
        question.sharing += 1;
        question.requesting = 0;
        break;
      case 'down':
        question.sharing = question.sharing > 0 ? question.sharing - 1 : 0;
        break;
      default:
        question.sharing = 0;
    }
  }

  onSubmit(){
    //console.log('showdata', this.prompts);
    for(let x = 0; x < this.prompts.length; x++){
      this.promptService.savePrompts(this.prompts[x]).subscribe((val) => {
        console.log('savePrompts', val);
  
      });
    }
    
  }
}
