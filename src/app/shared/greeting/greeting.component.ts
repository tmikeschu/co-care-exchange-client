import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {Observable, Subscription} from 'rxjs';

import { UserService } from './../../services/auth/user.service';
import { GreetingService } from './../../services/greeting.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: [ './greeting.component.scss' ]
})
export class GreetingComponent implements OnInit, OnDestroy {
  @Input()
  username = 'Username';

  @Input()
  subline = 'Let\'s find your x-factor';

  statusSub: Subscription;

  isHandSet$: Observable<boolean> = this
    .breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor (
    private userService: UserService,
    public greetingService: GreetingService,
    private breakpointObserver: BreakpointObserver,
  ) {
    if (this.userService.getUser()) {
      this.username = this.userService.getUser().firstName;
    }
  }

  ngOnInit () {
    this.statusSub = this.greetingService.status.subscribe(( status: string ) => this.subline = status);
  }

  ngOnDestroy () {
    if (this.statusSub) {
      this.statusSub.unsubscribe();
    }
  }

}
