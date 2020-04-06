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
  selectedPrompts: any[] = [];
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
  showSpecificQuestions:boolean = false;
  showGroupTypeQuestions: boolean = true;
  groupTypeList: {}[] = [];
  showGoToQuestionsBtn: boolean = true;
  showGoBackToGroupTypesBtn: boolean = false;
  showSubmitAnswersBtn: boolean = false;
  showChangeAnswersBtn: boolean = false;
  groupTypeRdo: any[] = [
    {
      key: 'Yes',
      checked: false,
    },
    {
      key: 'No',
      checked: true
    }
  ];

  constructor(private promptService: PromptService, private router: Router) {}

  ngOnInit() {
    //TODO: get the grouptype from the logged in user type
    this.promptService.getPrompts('org').subscribe((val) => {
      console.log('ngOnInit', val);
      this.prompts = val.data.prompts;
      
      //for test data
      let counter = 4;
      for(let x = 0; x < val.data.prompts.length; x++){   
        if(counter > 0){          
          this.prompts[x].promptType = 'Meat';
          counter--;
        }

        if(!this.selectedPrompts.find(element => element['promptType'] == this.prompts[x].promptType)){
          this.selectedPrompts.push({'promptType':this.prompts[x].promptType, 'showQuestions':'No', 'prompts': []});
        }
      }     
      console.log('this.selectedPrompts', this.selectedPrompts);
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

    this.showSpecificQuestions = false;
    this.showConfirm = true;
    this.showGoBackToGroupTypesBtn = false;
    this.showSubmitAnswersBtn = false;
    this.showChangeAnswersBtn = true;

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
    this.showConfirmBtn = false;
    this.showSubmitAnswersBtn = true;
    this.showChangeAnswersBtn = false;
    this.showSpecificQuestions = true;
    this.showGoBackToGroupTypesBtn = true;
  }

  onGoToQuestions(){
    let addedprompt = false;
    for(let y = 0; y < this.selectedPrompts.length; y++){
      this.selectedPrompts[y]['prompts'] = [];
    }
    
    for(let x = 0; x < this.prompts.length; x++){
      
      for(let y = 0; y < this.selectedPrompts.length; y++){        
        
        if(this.prompts[x].promptType == this.selectedPrompts[y]['promptType'] && this.selectedPrompts[y]['showQuestions'] == 'Yes'){
          
          if(typeof this.prompts[x].unitsOfIssue !='undefined' && this.prompts[x].unitsOfIssue){
            this.prompts[x].unitsOfIssueChoices = this.prompts[x].unitsOfIssue.split(', ');
            this.prompts[x].unitsOfIssue = this.prompts[x].unitsOfIssueChoices[0];
          }
          
          if(typeof this.prompts[x].sizes !='undefined' && this.prompts[x].sizes){
            this.prompts[x].sizeChoices = this.prompts[x].sizes.split(', ');
            this.prompts[x].size = this.prompts[x].sizeChoices[0];
          }

          this.selectedPrompts[y]['prompts'].push(this.prompts[x]);
          addedprompt = true;
        }
        
      }

      this.prompts[x].sharing = 0;
      this.prompts[x].requesting = 0;
      
    }       
    
    if(addedprompt){
      this.showSpecificQuestions = true;
      this.showGroupTypeQuestions = false;
      this.showGoBackToGroupTypesBtn = true;
      this.showGoToQuestionsBtn = false;
      this.showSubmitAnswersBtn = true;
    }
  }

  onGoBackToGroupTypes(){
    this.showSpecificQuestions = false;
    this.showGroupTypeQuestions = true;
    this.showGoBackToGroupTypesBtn = false;
    this.showGoToQuestionsBtn = true;
    this.showSubmitAnswersBtn = false;
  }

}
