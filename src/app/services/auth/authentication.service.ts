import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Injectable, NgZone} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable, ReplaySubject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {UserService} from './user.service';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
    constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private zone: NgZone
  ) { }

  login(email: string, password: string) {
    console.log(environment.serverUrl);
    return this.http.post(`${environment.serverUrl}authenticate`, {email, password})
      .pipe(map((response: any) => {
      }));
  }

  register(firstName: string, lastName: string, email: string, password: string) {
    return this.http.post(`${environment.serverUrl}register`, {firstName: firstName, lastName: lastName, email: email, password: password})
      .pipe(map((response: any) => {
        // this.authorize(response);
      }));
  }

  logout() {
    // remove user from local storage to log user ou
    localStorage.removeItem('user');
    this.userService.setUser(null);
    this.router.navigate(['/']);
  }
}
