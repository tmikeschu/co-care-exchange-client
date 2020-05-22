import { Component, OnInit } from '@angular/core';
import { Prompt } from 'src/app/models/cce/prompt';
import { PromptService } from 'src/app/core/services/cce/prompt.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { SaveUserInput } from 'src/app/graphql/models/save-user-input.model';
import { AuthenticationService } from 'src/app/core/services/cce/authentication.service';
import { filter } from 'rxjs/operators';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-prompts',
  templateUrl: './prompts.component.html',
  styleUrls: ['./prompts.component.scss'],
})
export class PromptsComponent implements OnInit {
  prompts: Prompt[];
  multiselectPrompts: any[] = [];
  selectedPrompts: any[] = [];
  surveyQuestions: Prompt[] = [];
  promptKeys: string[];
  promptTypeQuestion: string;
  showConfirm = false;
  promptMap: any = new Map();
  promptTypeIndex = 0;
  shares: any[] = [];
  userType: string;
  requests: any[] = [];
  prompt: Prompt;
  user: SaveUserInput;
  promptIndex = 0;
  surveyTime = false;
  inNeed: boolean;
  showSpecificQuestions = false;
  showGroupTypeQuestions = true;
  showMultipleSelect = false;
  showMultipleSelectBtn = true;
  groupTypeList: {}[] = [];
  showConfirmBtn = false;
  showGoToQuestionsBtn = false;//true;
  showGoBackToGroupTypesBtn = false;
  showSubmitAnswersBtn = false;
  showChangeAnswersBtn = false;
  showGoBackMultipleSelectBtn = false;
  userEmail: string;
  promptGroups: any[];
  groupTypeRdo: any[] = [
    {
      key: 'Yes',
      checked: false,
    },
    {
      key: 'No',
      checked: true,
    },
  ];

  multiitem: any;
  multiItemFilters: any[] = [
    {
      key: 1, value: 'Value 1',
    },
    {
      key: 2, value: 'Value 2',
    },
    {
      key: 3, value: 'Value 3',
    },
    {
      key: 4, value: 'Value 4',
    }
  ];

  constructor(private promptService: PromptService, private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.configure();
  }

  private configure(): void {
    const userProfile = this.userService.getCurrentUserProfile();
    if (userProfile) {
      this.userEmail = this.userService.getCurrentUserEmail();
      console.log('DEBUG using saved userprofile for prompts for ' + this.userEmail);
      this.configureUser(userProfile);
      this.configurePrompts();
    } else {
      this.userEmail = this.userService.getCurrentUserEmail();
      console.log('DEBUG retrieving  userprofile for prompts for email ' + this.userEmail);


      this.userService.getUser(this.userEmail).subscribe((user) => {

        this.configureUser(user);
        

        this.configurePrompts();
      });
    }
  }

  private configureUser(userProfile): void {
    if (userProfile == null) {
      console.error('Unable to process user, profile is null');
      this.router.navigate(['/', 'welcome']);
    }

    this.userType = 'ind';

    if (userProfile.organization != null) {
      this.userType = 'org';
    }
  }

  private configurePrompts(): void {
    this.promptService.getPrompts(this.userType).subscribe((prompts) => {
      console.log('getPrompts', prompts);
      this.prompts = prompts.data.prompts;
      this.promptGroups = [];

       for (let x = 0; x < prompts.data.prompts.length; x++) {
          if (!this.promptGroups.find((element) => element['groupName'] === this.prompts[x].groupName)) {
            this.promptGroups.push({ groupName: this.prompts[x].groupName, showQuestions: 'No', prompts: [this.prompts[x]] });
          }  
          else{
            let p = this.promptGroups.find((element) => element['groupName'] === this.prompts[x].groupName);
            p.prompts.push(this.prompts[x]);
          }      
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

  onSubmit() {
    //console.log('requests', this.requests);
    //console.log('shares', this.shares);

    //this.shares = [];
    //this.requests = [];

    for (let x = 0; x < this.selectedPrompts.length; x++) {
      if (this.selectedPrompts[x].sharing > 0) {
        if (!this.shares.find((element) => element === this.selectedPrompts[x].groupName)) {
          this.shares.push(this.selectedPrompts[x]);
        }
      }

      if (this.selectedPrompts[x].requesting > 0) {
        if (!this.requests.find((element) => element === this.selectedPrompts[x].groupName)) {
          this.requests.push(this.selectedPrompts[x]);
        }
      }
    }

    
    this.showSpecificQuestions = false;
    this.showConfirm = true;
    this.showGoBackToGroupTypesBtn = false;
    this.showSubmitAnswersBtn = false;
    this.showChangeAnswersBtn = true;
    this.showGoBackMultipleSelectBtn = false;

    if (this.requests.length < 1 && this.shares.length < 1) {
      this.showConfirmBtn = false;
    } else {
      this.showConfirmBtn = true;
    }

  }

  onConfirm() {
    for (let y = 0; y < this.selectedPrompts.length; y++) {
      if (this.selectedPrompts[y].sharing !== 0 || this.selectedPrompts[y].requesting !== 0) {
        console.log('onConfirm item', this.selectedPrompts[y]);
        this.promptService.savePrompts(this.selectedPrompts[y]).subscribe((val) => {
          console.log('savePrompts return', val);
          this.router.navigate(['/dashboard']);
        });
      }
    }

    // // console.log('onConfirm selectedPrompts', this.selectedPrompts);
    // for (let x = 0; x < this.selectedPrompts.length; x++) {
    //   if (this.selectedPrompts[x].showQuestions === 'Yes') {
    //     // console.log('onConfirm prompts', this.selectedPrompts[x].prompts);
    //     for (let y = 0; y < this.selectedPrompts[x].prompts.length; y++) {
    //       if (this.selectedPrompts[x].prompts[y].sharing !== 0 || this.selectedPrompts[x].prompts[y].requesting !== 0) {
    //         console.log('onConfirm item', this.selectedPrompts[x].prompts[y]);
    //         this.promptService.savePrompts(this.selectedPrompts[x].prompts[y]).subscribe((val) => {
    //           console.log('savePrompts return', val);
    //           this.router.navigate(['/dashboard']);
    //         });
    //       }
    //     }
    //   }
    // }
  }

  onCancelBackToDashboard(){
    this.router.navigate(['/dashboard']);
  }

  onChangeAnswers() {
    this.showSpecificQuestions = true;
    this.showMultipleSelect = false;
    this.showGoBackMultipleSelectBtn = true;
    this.showGoBackToGroupTypesBtn = false;
    this.showGoToQuestionsBtn = false;
    this.showSubmitAnswersBtn = true;
    this.showConfirm = false;
    this.showConfirmBtn = false;
    this.showChangeAnswersBtn = false;
  }

  onGoToQuestions() {
    this.selectedPrompts = [];
    console.log('onGoToQuestions - this.multiselectPrompts', this.multiselectPrompts);
    for(let x = 0; x < this.multiselectPrompts.length; x++){
      for(let y = 0; y < this.multiselectPrompts[x].multiprompts.length; y++){
        if(typeof this.multiselectPrompts[x].multiprompts[y].multiselect != 'undefined' && this.multiselectPrompts[x].multiprompts[y].multiselect.length > 0){
          //console.log('selected item', this.multiselectPrompts[x].multiprompts[y]);
          for(let z = 0; z < this.multiselectPrompts[x].multiprompts[y].multiselect.length; z++){
            if(this.multiselectPrompts[x].multiprompts[y].removedQuestion === false){
              this.multiselectPrompts[x].multiprompts[y].size = this.multiselectPrompts[x].multiprompts[y].multiselect[z];
              this.multiselectPrompts[x].multiprompts[y].requesting = 0;
              this.multiselectPrompts[x].multiprompts[y].sharing = 0;
              let item = Object.assign({}, this.multiselectPrompts[x].multiprompts[y]);
              this.selectedPrompts.push(item);
            }
          }          
        }
      }
    }

    //console.log('this.selectedPrompts', this.selectedPrompts);
    this.showSpecificQuestions = true;
    this.showMultipleSelect = false;
    this.showGoBackMultipleSelectBtn = true;
    this.showGoBackToGroupTypesBtn = false;
    this.showGoToQuestionsBtn = false;
    this.showSubmitAnswersBtn = true;
    this.showConfirm = false;

    //  console.log('onGoToQuestions prompts', this.prompts);
    //  console.log('onGoToQuestions selectedPrompts', this.selectedPrompts);

     //let addedprompt = false;

    // for (let y = 0; y < this.selectedPrompts.length; y++) {
    //   this.selectedPrompts[y]['prompts'] = [];
    // }

    // for (let x = 0; x < this.prompts.length; x++) {
    //   this.prompts[x].unitsOfIssueChoices = [];
    //   this.prompts[x].sizeChoices = [];
    //   this.prompts[x].unit = null;
    //   this.prompts[x].size = null;

    //   for (let y = 0; y < this.selectedPrompts.length; y++) {
    //     if (this.prompts[x].groupName == this.selectedPrompts[y]['groupName'] && this.selectedPrompts[y]['showQuestions'] == 'Yes') {
    //       if (typeof this.prompts[x].unitsOfIssue != 'undefined' && this.prompts[x].unitsOfIssue) {
    //         this.prompts[x].unitsOfIssueChoices = this.prompts[x].unitsOfIssue.split(',');
    //         this.prompts[x].unit = this.prompts[x].unitsOfIssueChoices[0];
    //       }

    //       if (typeof this.prompts[x].sizes != 'undefined' && this.prompts[x].sizes) {
    //         this.prompts[x].sizeChoices = this.prompts[x].sizes.split(',');
    //         this.prompts[x].size = this.prompts[x].sizeChoices[0];
    //       }

    //       this.selectedPrompts[y]['prompts'].push(this.prompts[x]);
    //       addedprompt = true;
    //     }
    //   }

    //   this.prompts[x].sharing = 0;
    //   this.prompts[x].requesting = 0;
    // }

    //if (addedprompt) {
      // this.showSpecificQuestions = false;
      // this.showGroupTypeQuestions = false;
      // this.showGoBackToGroupTypesBtn = true;
      // this.showGoToQuestionsBtn = false;
      // this.showSubmitAnswersBtn = true;
    //}
  }

  onGoBackToGroupTypes() {
    this.showSpecificQuestions = false;
    this.showGroupTypeQuestions = true;
    this.showGoBackToGroupTypesBtn = false;
    this.showSubmitAnswersBtn = false;
    this.showMultipleSelect = false;
    this.showMultipleSelectBtn = true;
    this.showGoToQuestionsBtn = false;
  }

  onGoBackMultipleSelect(){
    this.showMultipleSelectBtn = false;
    this.showMultipleSelect = true;
    this.showSpecificQuestions = false;
    this.showGroupTypeQuestions = false;
    this.showGoBackToGroupTypesBtn = true;
    this.showGoToQuestionsBtn = true;
    this.showSubmitAnswersBtn = false;
    this.showGoBackMultipleSelectBtn = false;
  }

  // nextvals(){
    
  //   this.selectedPrompts = [];
  //   console.log('nextvals - this.multiselectPrompts', this.multiselectPrompts);
  //   for(let x = 0; x < this.multiselectPrompts.length; x++){
  //     for(let y = 0; y < this.multiselectPrompts[x].multiprompts.length; y++){
  //       if(typeof this.multiselectPrompts[x].multiprompts[y].multiselect != 'undefined' && this.multiselectPrompts[x].multiprompts[y].multiselect.length > 0){
  //         console.log('selected item', this.multiselectPrompts[x].multiprompts[y]);
  //         for(let z = 0; z < this.multiselectPrompts[x].multiprompts[y].multiselect.length; z++){
  //           this.multiselectPrompts[x].multiprompts[y].size = this.multiselectPrompts[x].multiprompts[y].multiselect[z];
  //           this.multiselectPrompts[x].multiprompts[y].requesting = 0;
  //           this.multiselectPrompts[x].multiprompts[y].sharing = 0;
  //           let item = Object.assign({}, this.multiselectPrompts[x].multiprompts[y]);
  //           this.selectedPrompts.push(item);
  //         }
          
  //       }
  //     }
  //   }

  //   console.log('this.selectedPrompts', this.selectedPrompts);
  //   this.showSpecificQuestions = true;
  // }

  onGoToMultipleSelect(){
    console.log('onGoToMultipleSelect - promptGroups', this.promptGroups);

    this.multiselectPrompts = [];
    for (let x = 0; x < this.promptGroups.length; x++) {
      if(this.promptGroups[x]['showQuestions'] == 'Yes'){
        for(let y = 0; y < this.promptGroups[x].prompts.length; y++){
          this.promptGroups[x].prompts[y].unitsOfIssueChoices = (this.promptGroups[x].prompts[y].unitsOfIssue != null) ? this.promptGroups[x].prompts[y].unitsOfIssue.split(','):null;
          this.promptGroups[x].prompts[y].sizeChoices = (this.promptGroups[x].prompts[y].sizes != null) ? this.promptGroups[x].prompts[y].sizes.split(','): null;
          this.promptGroups[x].prompts[y].unit = (this.promptGroups[x].prompts[y].unitsOfIssueChoices != null) ? this.promptGroups[x].prompts[y].unitsOfIssueChoices[0]: null;
          this.promptGroups[x].prompts[y].size = (this.promptGroups[x].prompts[y].sizeChoices != null) ? this.promptGroups[x].prompts[y].sizeChoices[0]: null;
          this.promptGroups[x].prompts[y].removedQuestion = false;

          if(this.promptGroups[x].prompts[y].sizeChoices != null){        
                
              if(this.multiselectPrompts.filter(e => e.groupName === this.promptGroups[x]['groupName']).length > 0){
                let item = this.multiselectPrompts.filter(e => e.groupName == this.promptGroups[x]['groupName'])[0];
                item['multiprompts'].push(this.promptGroups[x].prompts[y]);
              }else{
                  this.multiselectPrompts.push({
                    'groupName':this.promptGroups[x]['groupName'],
                    'multiprompts':[this.promptGroups[x].prompts[y]],
                    'singleprompts':[]                 
                  });                 
              }
            }else{
              if(this.multiselectPrompts.filter(e => e.groupName === this.promptGroups[x]['groupName']).length > 0){
                let item = this.multiselectPrompts.filter(e => e.groupName == this.promptGroups[x]['groupName'])[0];
                item['singleprompts'].push(this.promptGroups[x].prompts[y]);
              }else{
                  this.multiselectPrompts.push({
                    'groupName':this.promptGroups[x]['groupName'],
                    'multiprompts':[],
                    'singleprompts':[this.promptGroups[x].prompts[y]]                  
                  });                 
              }
            }
            


          console.log('show prompt', this.promptGroups[x].prompts[y]);
        }        
      }
    }

    // for (let y = 0; y < this.selectedPrompts.length; y++) {
    //   this.selectedPrompts[y]['prompts'] = [];
    // }

    // for (let x = 0; x < this.prompts.length; x++) {
    //   this.prompts[x].unitsOfIssueChoices = [];
    //   this.prompts[x].sizeChoices = [];
    //   this.prompts[x].unit = null;
    //   this.prompts[x].size = null;

    //   for (let y = 0; y < this.selectedPrompts.length; y++) {
    //     if (this.prompts[x].groupName == this.selectedPrompts[y]['groupName'] && this.prompts[x]['showQuestions'] == 'Yes') {
    //       if (typeof this.prompts[x].unitsOfIssue != 'undefined' && this.prompts[x].unitsOfIssue) {
    //         this.prompts[x].unitsOfIssueChoices = this.prompts[x].unitsOfIssue.split(',');
    //         this.prompts[x].unit = this.prompts[x].unitsOfIssueChoices[0];
    //       }

    //       if (typeof this.prompts[x].sizes != 'undefined' && this.prompts[x].sizes) {
    //         this.prompts[x].sizeChoices = this.prompts[x].sizes.split(',');
    //         this.prompts[x].size = this.prompts[x].sizeChoices[0];
    //       }

    //       if(this.prompts[x].sizeChoices.length > 0){        
            
    //         if(this.multiselectPrompts.filter(e => e.groupName === this.selectedPrompts[y]['groupName']).length > 0){
    //           let item = this.multiselectPrompts.filter(e => e.groupName == this.selectedPrompts[y]['groupName'])[0];
    //           item['multiprompts'].push(this.prompts[x]);
    //         }else{
    //             this.multiselectPrompts.push({
    //               'groupName':this.selectedPrompts[y]['groupName'],
    //               'multiprompts':[this.prompts[x]],
    //               'singleprompts':[]                 
    //             });                 
    //         }
    //       }else{
    //         if(this.multiselectPrompts.filter(e => e.groupName === this.selectedPrompts[y]['groupName']).length > 0){
    //           let item = this.multiselectPrompts.filter(e => e.groupName == this.selectedPrompts[y]['groupName'])[0];
    //           item['singleprompts'].push(this.prompts[x]);
    //         }else{
    //             this.multiselectPrompts.push({
    //               'groupName':this.selectedPrompts[y]['groupName'],
    //               'multiprompts':[],
    //               'singleprompts':[this.prompts[x]]                  
    //             });                 
    //         }
    //       }
    //     }
    //   }
    // }

    console.log('multiselectPrompts', this.multiselectPrompts);
    
    
    this.showMultipleSelectBtn = false;
    this.showMultipleSelect = true;
    this.showSpecificQuestions = false;
    this.showGroupTypeQuestions = false;
    this.showGoBackToGroupTypesBtn = true;
    this.showGoToQuestionsBtn = true;
    this.showSubmitAnswersBtn = false;
  }

  removeMultiItem(item){
    console.log('removeMultiItem - item', item);
    console.log('removeMultiItem - multiselectPrompts' ,this.multiselectPrompts);
    item.multiselect = [];
    if(item.removedQuestion === true){
    item.removedQuestion = false;
    }else{
      item.removedQuestion = true;
    }    
  }

  removeSingleItem(item){
    console.log('removeSingleItem - item', item);
    console.log('removeSingleItem - multiselectPrompts' ,this.multiselectPrompts);
    if(item.removedQuestion === true){
      item.removedQuestion = false;
      }else{
        item.removedQuestion = true;
      }
  }

}
