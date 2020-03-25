import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  constructor(
    private http: HttpClient,
  ) {}


  getPrompts(): any {

    const httpOptions = {
      headers: new HttpHeaders({'x-api-key': 'KmFXIagDOypuL6YtCMzuaOyhs9cFodW2n6MK1eS1'})
    };
    const query = {
      'query': 'query GetPrompts {prompts{id,audience,display,groupName,promptType,sizes,item,unitsOfIssue}}',
      'variables': {}
    };
    return this.http.post<any>(`${environment.serverUrl}`, query, httpOptions);
  }
}
