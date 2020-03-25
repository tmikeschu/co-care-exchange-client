import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class GreetingService {
  public status = new ReplaySubject(1);

  setStatus(status: string) {
    this.status.next(status);
  }
}

