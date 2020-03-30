import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { signIn } from '../../aws-cognito/cognito/signin';
import { changePassword, forgetPassword, forgetPasswordComplete } from '../../aws-cognito/cognito/password';
import { BasicRegistrationModel } from '../../models/cce/basic-registration.model';
import { register } from '../../aws-cognito/cognito/register';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private user: any;
  constructor(private router: Router, private http: HttpClient) {}

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
    const result = await signIn(username, password);
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
}
