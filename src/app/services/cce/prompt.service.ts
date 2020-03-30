import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { Prompt } from 'src/app/models/cce/prompt';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  constructor(private http: HttpClient) {}

  getPrompts(userType:string): any {
    const httpOptions = {
      headers: new HttpHeaders({'x-api-key': 'S9QuqK35427hOdIrD41fp8ThyA9zMxWa4I7sC2bm'})
    };

    const query = {
      'query':'query GetPrompts { prompts(where: { audience_contains: "' + userType + '"}) { id, promptType, groupName, item, unitsOfIssue, sizes, display } }',
      'variables':{}};

    return this.http.post<any>(`${environment.serverUrl}`, query, httpOptions);
  }

  savePrompts(prompt:Prompt): any {

    const httpOptions = {
      headers: new HttpHeaders({'x-api-key': 'S9QuqK35427hOdIrD41fp8ThyA9zMxWa4I7sC2bm'})
    };

    const query = {
      'operationName': 'PromptAnswerMutations',
      'query':`mutation PromptAnswerMutations($input: CreateAnswerInput!) {
        createAnswer(input: $input) {
          answer {
            id,
            promptId,
            numberValue
          },
          clientMutationId
        }
      }`,
      'variables':{'input':{
        "promptId": prompt.id,
        "userId": "22201103-DEC0-466F-B44F-1926BC1687C1",
        "numberValue": (prompt.sharing > 0)?prompt.sharing:prompt.requesting,
        "unitOfIssue": prompt.unitsOfIssue,
        "clientMutationId": "123474"
        }
      }
    };

    return this.http.post<any>(`${environment.serverUrl}`, query, httpOptions);
  }
}
