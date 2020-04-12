import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { currentAuthenticatedUser, getCurrentUserInfo, signIn, signOut } from '../../../aws-cognito/cognito/signin';
import { changePassword, forgetPassword, forgetPasswordComplete } from '../../../aws-cognito/cognito/password';
import { BasicRegistrationModel } from '../../../models/cce/basic-registration.model';
import { register } from '../../../aws-cognito/cognito/register';
import {map, share} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AmplifyService } from 'aws-amplify-angular';
import {BehaviorSubject} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userSubject$ = new BehaviorSubject<any>(undefined);
  private user$ = this.userSubject$.pipe(share());
  private user: any;
  signedIn = false;
  constructor(private router: Router, private http: HttpClient, private amplifyService: AmplifyService) {
    this.amplifyService.authStateChange$
        .subscribe(authState => {
          console.log('DEBUG authState.state ', authState.state);
          this.signedIn = authState.state === 'signedIn';
          if (!authState.user) {
            this.user = null;
          } else {
            this.user = authState.user;
            if (this.user) {
              this.user.userProfile = this.getUserProfile();
            }
            console.log('DEBUG this.user ', this.user);
          }
          this.userSubject$.next(this.user);
        });
  }

  getUser$(): any {
    return this.user$;
  }

  getUser(): any {
    return this.user;
  }

  saveUserProfile(profile: unknown): void {
    window.localStorage.setItem('userProfile', JSON.stringify(profile));
    if (this.user) {
      this.user.userProfile = profile;
    }
  }

  getUserProfile(): unknown {
    const up = window.localStorage.getItem('userProfile');
    if (up) {
      const profile = JSON.parse(up);
      return profile;
    }
    return null;
  }

  // async getUser(): Promise<any> {
  //   if (this.user) {
  //     return this.user;
  //   }
  //   // check for saved session
  //   const cu = await currentAuthenticatedUser();
  //   this.user = cu;
  //   if (this.user) {
  //     this.user.userProfile = this.getUserProfile();
  //   }
  //   return this.user;
  // }

  getIdToken(): string {
    return this.user ? this.user.getSignInUserSession().getIdToken() : '';
  }

  getFirstName(): string {
    return this.user ? this.user.attributes.given_name : '';
  }

  getLastName(): string {
    return this.user ? this.user.attributes.family_name : '';
  }

  getEmail(): string {
    return this.user ? this.user.attributes.email : '';
  }

  getGroups(): string[] {
    // TODO move cognito specific stuff out of here and consider using a proxy/lens
    if (!this.user || !this.user.signInUserSession) {
      return [];
    }
    const userGroups = this.user.signInUserSession.accessToken.payload['cognito:groups'];
    return userGroups || [];
  }

  isInGroup(group: string): boolean {
    if (!group) {
      return false;
    }
    return this.getGroups().includes(group);
  }

  async register(registrationModel: BasicRegistrationModel) {
    // TODO: re-eval...get ride of reg service?
    // return this.registrationService.register(registrationModel);
    return await register(registrationModel);
  }

  async signIn(username: string, password: string, organization?: any) {
    const result = await signIn(username, password, organization);
    this.user = result.user;
    // check if user is in org
    if (organization) {
      const inOrg = this.isInOrg(result.user, organization);
      if (!inOrg) {
        // error
        this.user = null;
        result.user = null;
        result.errorMsg = 'Invalid username, password, or organization';
        return result;
      }
    }
    // store user object for user operations like change password
    this.user = result.user;
    return result;
  }

  private isInOrg(user: any, organization: any): boolean {
    const userGroups = this.getGroups();
    const orgInCognitoFormat = organization.name.replace(/ /g, '_');
    console.log('DEBUG orgInCognitoFormat ', orgInCognitoFormat);
    console.log('DEBUG userGroups ', userGroups);
    return userGroups.some((e) => e === orgInCognitoFormat);
  }

  async forgetPassword(username: string) {
    return forgetPassword(username);
  }

  async forgetPasswordComplete(username: string, code: string, newPassword: string) {
    return forgetPasswordComplete(username, code, newPassword);
  }

  async changePassword(oldPassword: string, newPassword: string) {
    if (!this.user) {
      throw new Error('Please signin before changing password');
    }
    return changePassword(this.user, oldPassword, newPassword);
  }

  login(email: string, password: string) {
    console.log(environment.serverUrl);
    return this.http.post(`${environment.serverUrl}authenticate`, { email, password }).pipe(map((response: any) => {}));
  }

  async logout() {
    // remove user from local storage to log user out
    this.user = null;
    await signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    return await this.router.navigate(['/']);
  }
}
