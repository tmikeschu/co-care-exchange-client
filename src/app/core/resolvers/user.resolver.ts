import { Injectable } from '@angular/core';

import {Resolve, Router} from '@angular/router';
import { AuthenticationService } from '../services/cce/authentication.service';
import {catchError, first, mergeMap} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<any> {
  constructor( private router: Router, private authenticationService: AuthenticationService) {}

  resolve() {
    console.log('DP resolve entry');
    return this.authenticationService.getUser$().pipe(first(u => u !== undefined),
      catchError((error) => {
        // route to /
        return this.router.navigate(['/']);
      }),
      mergeMap((user: any) => {
        console.log('DP resolver result ', user);
        if (user) {
          return of(user);
        } else {
          return this.router.navigate(['/']);
        }
      })
    );
  }
}
