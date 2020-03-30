import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AnswerModel } from '../../models/cce/answer-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  constructor(
    private http: HttpClient,
  ) { }


  postAnswer(answer: AnswerModel): Observable<any> {

    console.log(answer);

    const httpOptions = {
      headers: new HttpHeaders({ 'x-api-key': 'S9QuqK35427hOdIrD41fp8ThyA9zMxWa4I7sC2bm' })
    };

    const input = {
      'operationName': 'PromptAnswerMutations',
      'query': 'mutation PromptAnswerMutations($input: CreateAnswerInput!) {createAnswer(input: $input) {answer {\n id\n promptId\n }\n clientMutationId\n}\n}\n',
      'variables': {
        'input': answer
      }
    };


    return this.http.post<any>(`${environment.serverUrl}`, input, httpOptions);
  }
}
