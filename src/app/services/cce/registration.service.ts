import { Injectable } from '@angular/core';
import { register } from '../../aws-cognito/cognito/register';
import { BasicRegistrationModel } from '../../models/cce/basic-registration.model';

// TDOD --remove this service if not needed...no longer being used

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor() {}

  async register(regModel: BasicRegistrationModel) {
    return await register(regModel);
  }
}
