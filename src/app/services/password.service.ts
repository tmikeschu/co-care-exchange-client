import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {User} from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private serverUrl: string = environment.serverUrl;

  constructor ( private http: HttpClient ) {
  }

  public forgotPassword ( email ): Observable<String> {
    return this.http.post<String>(`${this.serverUrl}forgot?email=${email}`, {});
  }

  public getUserByToken ( token ): Observable<User> {
    return this.http.get<User>(`${this.serverUrl}reset?token=${token}`);
  }

  public update ( token, password ): Observable<String> {
    return this.http.put<String>(`${this.serverUrl}updatePassword?token=${token}&password=${password}`, {});
  }
}
