import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(emailAddress: String) {
    // const query = {
    //   query: 'query GetPrompts {prompts{id,audience,display,groupName,promptType,sizes,item,unitsOfIssue}}',
    //   variables: {},
    // };
    // return this.http.post<any>(`${environment.serverUrl}`, query);
  }

  saveUser(userProfile: unknown) {}
}


