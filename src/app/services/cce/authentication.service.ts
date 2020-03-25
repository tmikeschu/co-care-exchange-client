﻿import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { RegistrationModel } from '../../models/cce/registrationModel';
import { RegistrationService } from './registration.service';
import { signIn } from '../../aws-cognito/cognito/signin';
import { changePassword, forgetPassword } from '../../aws-cognito/cognito/password';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private user: any;
  constructor(private router: Router, private http: HttpClient, private registrationService: RegistrationService) {}

  async register(registrationModel: RegistrationModel) {
    // TODO: re-eval...get ride of reg service?
    return this.registrationService.register(registrationModel);
  }

  async signIn(username: string, password: string) {
    const result = await signIn(username, password);
    // store user object for user operations like change password
    this.user = result.user;
    return result;
  }

  async forgetPassword(username: string) {
    return forgetPassword(username);
  }

  async changePassword(oldPassword: string, newPassword: string) {
    if (!this.user) {
      throw new Error('Please signin before changing password');
    }
    return changePassword(this.user, oldPassword, newPassword);
  }
}
