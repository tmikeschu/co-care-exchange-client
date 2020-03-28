import { Injectable } from '@angular/core';
import { register } from '../../aws-cognito/cognito/register';
import { BasicRegistrationModel } from '../../models/cce/basic-registration.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor() {}

  async register(regModel: BasicRegistrationModel) {
    const eml = regModel.email;
    const password = regModel.password;
    return await register(eml, password, eml);
  }
}
