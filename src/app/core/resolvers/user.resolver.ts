import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<any> {
  constructor() {
  }

  resolve() {
    return null;
  }
}
