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


  getPrompts(userType:string): any {

    const httpOptions = {
      headers: new HttpHeaders({'x-api-key': 'KmFXIagDOypuL6YtCMzuaOyhs9cFodW2n6MK1eS1'})
    };

    const query = {
      'query':'query GetPrompts { prompts(where: { audience_contains: "' + userType + '"}) { id, promptType, groupName, item, unitsOfIssue, sizes, display } }',
      'variables':{}};

    return this.http.post<any>(`${environment.serverUrl}`, query, httpOptions);
  }
}
