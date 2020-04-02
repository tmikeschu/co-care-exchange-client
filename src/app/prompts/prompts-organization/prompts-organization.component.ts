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
  showConfirm: boolean = false;
  showConfirmBtn: boolean = false;
  promptMap: any = new Map();
  promptTypeIndex = 0;
  shares: any[] = [];
  requests: any[] = [];
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
        if(typeof val.data.prompts[x].unitsOfIssue !='undefined' && val.data.prompts[x].unitsOfIssue){
          this.prompts[x].unitsOfIssueChoices = val.data.prompts[x].unitsOfIssue.split(', ');
          this.prompts[x].unitsOfIssue = this.prompts[x].unitsOfIssueChoices[0];
        }

        if(typeof val.data.prompts[x].sizes !='undefined' && val.data.prompts[x].sizes){
          this.prompts[x].sizeChoices = val.data.prompts[x].sizes.split(', ');
          this.prompts[x].size = this.prompts[x].sizeChoices[0];
        }

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
    
    this.shares = [];
    this.requests = [];

    for(let x = 0; x < this.prompts.length; x++){
      if(this.prompts[x].sharing > 0){        
        if(!this.shares.find(element => element == this.prompts[x].groupName)){
          this.shares.push(this.prompts[x]);
        }        
      }

      if(this.prompts[x].requesting > 0){
        if(!this.requests.find(element => element == this.prompts[x].groupName)){
          this.requests.push(this.prompts[x]);
        }        
      }
    }  
    this.showConfirm = true;
    if(this.requests.length < 1 && this.shares.length < 1){
      this.showConfirmBtn = false;
    }
    else{
      this.showConfirmBtn = true;
    }

    console.log('prompts', this.prompts);
    // console.log('requests', this.requests);
    // console.log('shares', this.shares);
  }

  onConfirm() {    
    for(let x = 0; x < this.prompts.length; x++){
      this.promptService.savePrompts(this.prompts[x]).subscribe((val) => {   
        console.log('savePrompts return', val);     
        this.router.navigate(['/dashboard']);
      });
    }     
  }

  onChangeAnswers(){
    this.showConfirm = false;
  }

}
