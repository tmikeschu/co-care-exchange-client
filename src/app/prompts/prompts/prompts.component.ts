import { Component, OnInit } from '@angular/core';
import { Prompt } from 'src/app/models/cce/prompt';
import { PromptService } from 'src/app/core/services/cce/prompt.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { SaveUserInput } from 'src/app/graphql/models/save-user-input.model';
import { AuthenticationService } from 'src/app/core/services/cce/authentication.service';

@Component({
  selector: 'app-prompts',
  templateUrl: './prompts.component.html',
  styleUrls: ['./prompts.component.scss'],
})
export class PromptsComponent implements OnInit {
  prompts: Prompt[];
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
  groupTypeList: {}[] = [];
  showConfirmBtn = false;
  showGoToQuestionsBtn = true;
  showGoBackToGroupTypesBtn = false;
  showSubmitAnswersBtn = false;
  showChangeAnswersBtn = false;
  userEmail: string;
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

      for (let x = 0; x < prompts.data.prompts.length; x++) {
        if (!this.selectedPrompts.find((element) => element['groupName'] == this.prompts[x].groupName)) {
          this.selectedPrompts.push({ groupName: this.prompts[x].groupName, showQuestions: 'No', prompts: [] });
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
    // console.log('onSubmit prompts', this.prompts);
    this.shares = [];
    this.requests = [];

    for (let x = 0; x < this.prompts.length; x++) {
      if (this.prompts[x].sharing > 0) {
        if (!this.shares.find((element) => element == this.prompts[x].groupName)) {
          this.shares.push(this.prompts[x]);
        }
      }

      if (this.prompts[x].requesting > 0) {
        if (!this.requests.find((element) => element == this.prompts[x].groupName)) {
          this.requests.push(this.prompts[x]);
        }
      }
    }

    this.showSpecificQuestions = false;
    this.showConfirm = true;
    this.showGoBackToGroupTypesBtn = false;
    this.showSubmitAnswersBtn = false;
    this.showChangeAnswersBtn = true;

    if (this.requests.length < 1 && this.shares.length < 1) {
      this.showConfirmBtn = false;
    } else {
      this.showConfirmBtn = true;
    }

    //console.log('submitted prompts', this.prompts);
    console.log('requests', this.requests);
    console.log('shares', this.shares);
  }

  onConfirm() {
    // console.log('onConfirm selectedPrompts', this.selectedPrompts);
    for (let x = 0; x < this.selectedPrompts.length; x++) {
      if (this.selectedPrompts[x].showQuestions == 'Yes') {
        // console.log('onConfirm prompts', this.selectedPrompts[x].prompts);
        for (let y = 0; y < this.selectedPrompts[x].prompts.length; y++) {
          if (this.selectedPrompts[x].prompts[y].sharing != 0 || this.selectedPrompts[x].prompts[y].requesting != 0) {
            console.log('onConfirm item', this.selectedPrompts[x].prompts[y]);
            this.promptService.savePrompts(this.selectedPrompts[x].prompts[y]).subscribe((val) => {
              console.log('savePrompts return', val);
              this.router.navigate(['/dashboard']);
            });
          }
        }
      }
    }
  }

  onCancelBackToDashboard(){
    this.router.navigate(['/dashboard']);
  }
  
  onChangeAnswers() {
    this.showConfirm = false;
    this.showConfirmBtn = false;
    this.showSubmitAnswersBtn = true;
    this.showChangeAnswersBtn = false;
    this.showSpecificQuestions = true;
    this.showGoBackToGroupTypesBtn = true;
  }

  onGoToQuestions() {
    // console.log('onGoToQuestions prompts', this.prompts);
    // console.log('onGoToQuestions selectedPrompts', this.selectedPrompts);

    let addedprompt = false;

    for (let y = 0; y < this.selectedPrompts.length; y++) {
      this.selectedPrompts[y]['prompts'] = [];
    }

    for (let x = 0; x < this.prompts.length; x++) {
      this.prompts[x].unitsOfIssueChoices = [];
      this.prompts[x].sizeChoices = [];
      this.prompts[x].unit = null;
      this.prompts[x].size = null;

      for (let y = 0; y < this.selectedPrompts.length; y++) {
        if (this.prompts[x].groupName == this.selectedPrompts[y]['groupName'] && this.selectedPrompts[y]['showQuestions'] == 'Yes') {
          if (typeof this.prompts[x].unitsOfIssue != 'undefined' && this.prompts[x].unitsOfIssue) {
            this.prompts[x].unitsOfIssueChoices = this.prompts[x].unitsOfIssue.split(',');
            this.prompts[x].unit = this.prompts[x].unitsOfIssueChoices[0];
          }

          if (typeof this.prompts[x].sizes != 'undefined' && this.prompts[x].sizes) {
            this.prompts[x].sizeChoices = this.prompts[x].sizes.split(',');
            this.prompts[x].size = this.prompts[x].sizeChoices[0];
          }

          this.selectedPrompts[y]['prompts'].push(this.prompts[x]);
          addedprompt = true;
        }
      }

      this.prompts[x].sharing = 0;
      this.prompts[x].requesting = 0;
    }

    if (addedprompt) {
      this.showSpecificQuestions = true;
      this.showGroupTypeQuestions = false;
      this.showGoBackToGroupTypesBtn = true;
      this.showGoToQuestionsBtn = false;
      this.showSubmitAnswersBtn = true;
    }
  }

  onGoBackToGroupTypes() {
    this.showSpecificQuestions = false;
    this.showGroupTypeQuestions = true;
    this.showGoBackToGroupTypesBtn = false;
    this.showGoToQuestionsBtn = true;
    this.showSubmitAnswersBtn = false;
  }

  testval(){
    console.log('multiitem', this.multiitem);
  }

}
