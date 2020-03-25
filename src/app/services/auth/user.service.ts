import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRoleType } from '../../models/user-role-type.enum';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { environment } from 'src/environments/environment';
import {User} from '../../models/User';

@Injectable({ providedIn: 'root' })
export class UserService {
  user: User;
  private serverUrl: string = environment.serverUrl;

  constructor (
    private router: Router,
    private http: HttpClient
  ) {
  }

  getUser (): User {
    if (!this.user) {
      this.router.navigate([ '/signIn' ]);
    }
    return this.user;
  }

  setUser ( user: User ) {
    this.user = user;
  }

  hasRole ( role: UserRoleType ): boolean {
    if (!this.user || !this.user.roles) { return false; }
    for (const r of this.user.roles) {
      if (r.name === role) {
        return true;
      }
    }

    return false;
  }
}
