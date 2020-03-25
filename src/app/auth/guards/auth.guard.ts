import {fromRoleName} from '../../models/user-role-type.enum';

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {UserService} from '../../services/auth/user.service';
import {NavbarService} from '../../services/navbar.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  store = localStorage;

  constructor(
    private router: Router,
    private navBarService: NavbarService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // const loggedInUser = !this.store.getItem('user') ? undefined : JSON.parse(this.store.getItem('user'));
    // if (loggedInUser) {
    //   this.userService.setUser(loggedInUser);
    //   this.navBarService.setLogin(true);
    // }
    //
    // const roles = route.data['roles'];
    //
    // let hasRole = false;
    // for (const r of roles) {
    //   if (this.userService.user && this.userService.hasRole(fromRoleName(r))) {
    //     hasRole = true;
    //     break;
    //   }
    // }
    //
    // if (this.authService.authorized && hasRole) {
    //   return true;
    // }
    //
    // this.authService.logout();
    // this.router.navigate(['/signIn']);
    // return false;
    return true;
  }
}
