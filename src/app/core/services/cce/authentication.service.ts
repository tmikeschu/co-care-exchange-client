import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { currentAuthenticatedUser, getCurrentUserInfo, signIn, signOut } from '../../../aws-cognito/cognito/signin';
import { changePassword, forgetPassword, forgetPasswordComplete } from '../../../aws-cognito/cognito/password';
import { BasicRegistrationModel } from '../../../models/cce/basic-registration.model';
import { register } from '../../../aws-cognito/cognito/register';
import { map, share } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AmplifyService } from 'aws-amplify-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userSubject$ = new BehaviorSubject<any>(undefined);
  private user$ = this.userSubject$.pipe(share());
  private userAsObs$ = this.userSubject$.asObservable();
  private user: any;
  signedIn = false;
  authState = null;
  constructor(private router: Router, private http: HttpClient, private amplifyService: AmplifyService) {
    this.amplifyService.authStateChange$.subscribe((authState) => {
      console.log('DEBUG router url ', this.router.url);
      console.log('DEBUG authState.state ', authState);
      console.log('DEBUG authState.state ', authState.state);
      const wasSignedOut = this.authState === 'signedOut';
      this.authState = authState.state;
      this.signedIn = authState.state === 'signedIn';

      if (!authState.user) {
        this.user = null;
      } else {
        this.user = authState.user;
        if (this.signedIn && this.user) {
          this.user.userProfile = this.getUserProfile(this.user.username);
        }
        console.log('DEBUG AuthenticationService this.user ', this.user);
        // TODO -- should this resolver load the user profile? I say yes, bue the logic and testing is bigger
        // so for not, if proior state was signedout and there is no user profile, allow auth to continue and app
        // can load userprofile
        if (!wasSignedOut && !this.user.userProfile) {
          // got user but no profile...not a valid user, make user login
          console.error('Invalid user for login, user profile missing');
          this.signedIn = false;
          const username = this.user.username;
          this.user = null;
          this.logout(username).then();

        }
      }
      this.userSubject$.next(this.user);
    });
  }

  getUser$(): any {
    return this.user$;
  }

  getUserAsObs$() {
    return this.userAsObs$;
  }

  getUser(): any {
    return this.user;
  }

  saveUserProfile(username: string, profile: unknown): void {
    if (!username) {
      return;
    }
    const key = `${username}.userProfile`;
    window.localStorage.setItem(key, JSON.stringify(profile));
    if (this.user) {
      this.user.userProfile = profile;
    }
  }

  getUserProfile(username: string): unknown {
    const key = `${username}.userProfile`;
    const up = window.localStorage.getItem(key);
    if (up) {
      const profile = JSON.parse(up);
      return profile;
    }
    return null;
  }

  getIdToken(): string {
    return this.user && this.user.getSignInUserSession() ? this.user.getSignInUserSession().getIdToken() : '';
  }

  getFirstName(): string {
    return this.user ? this.user.attributes.given_name : '';
  }

  getLastName(): string {
    return this.user ? this.user.attributes.family_name : '';
  }

  getUsername(): string {
    return this.user ? this.user.username : '';
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

  async signIn(username: string, password: string) {
    const result = await signIn(username, password);
    this.user = result.user;
    console.log('signIn- this.user', this.user);
    // check if user is in org
    if(this.user['organization'] != null){
      const inOrg = this.isInOrg(result.user);
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

  private isInOrg(user: any): boolean {
    const userGroups = this.getGroups();    
    const orgInCognitoFormat = user['organization'].replace(/ /g, '_');
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

  async logout(username?: string) {
    // remove user from local storage to log user out
    this.user = null;
    await signOut();
   // localStorage.removeItem('user');
    if (username) {
      const key = `${username}.userProfile`;
      localStorage.removeItem(key);
    }
    return await this.router.navigate(['/', 'welcome']);
  }
}
