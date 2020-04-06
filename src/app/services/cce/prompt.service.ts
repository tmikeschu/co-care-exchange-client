import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Prompt } from 'src/app/models/cce/prompt';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/models/User';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  user: User;
  constructor(private http: HttpClient, userservice: UserService) {
    this.user = userservice.getCurrentUserProfile();
  }

  getPrompts(userType: string): any {

    const query = {
      'query': 'query GetPrompts { prompts(where: { audience_contains: "' + userType + '"}) { id, promptType, groupName, item, unitsOfIssue, sizes, display } }',
      'variables': {}
    };

    return this.http.post<any>(`${environment.serverUrl}`, query);
  }

  savePrompts(prompt: Prompt): any {

    const query = {
      'operationName': 'PromptAnswerMutations',
      'query': `mutation PromptAnswerMutations($input: CreateAnswerInput!) {
        createAnswer(input: $input) {
          answer {
            id,
            promptId,
            numberValue
          },
          clientMutationId
        }
      }`,
      'variables': {
        'input': {
          "promptId": prompt.id,
          "userId": 'B8350BCF-B6A3-4239-82D9-3BAA7B1C83E3',//this.user.id,
          "numberValue": (prompt.sharing > 0) ? prompt.sharing : -prompt.requesting,
          "unitOfIssue": prompt.unitsOfIssue,
          "clientMutationId": "123474",
          "size": prompt.size
        }
      }
    };

    console.log('query: ', query);

    return this.http.post<any>(`${environment.serverUrl}`, query);
  }
}
