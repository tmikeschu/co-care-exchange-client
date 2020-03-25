import { Injectable } from '@angular/core';
import { register } from '../../aws-cognito/cognito/register';
import { RegistrationModel } from '../../models/cce/registrationModel';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor() {}

  async register(regModel: RegistrationModel) {
    const eml = regModel.email;
    const password = regModel.password;
    return await register(eml, password, eml);
  }
}
