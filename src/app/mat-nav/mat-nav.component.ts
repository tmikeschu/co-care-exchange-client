import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth/authentication.service';
import { NavbarService } from '../services/navbar.service';
import { UserService } from '../services/auth/user.service';
import { UserRoleType } from '../models/user-role-type.enum';

@Component({
  selector: 'app-mat-nav',
  templateUrl: './mat-nav.component.html',
  styleUrls: ['./mat-nav.component.scss']
})
export class MatNavComponent implements OnInit {

  @ViewChild('drawer', { static : false }) drawer: ElementRef;

  loggedIn = false;
  isPlayer: boolean;
  isCoach: boolean;

  isHandset$: Observable<boolean> = this
    .breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));


  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthenticationService,
    private navbarService: NavbarService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.isPlayer = this.userService.hasRole(UserRoleType.Player);
    this.isCoach = this.userService.hasRole(UserRoleType.Coach);
    this.navbarService.login.subscribe((val: boolean) => {
      this.loggedIn = val;
    });
  }

  logout() {
    this.authService.logout();
    this.navbarService.setLogin(false);
  }

}
