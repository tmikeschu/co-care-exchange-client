// from https://aws-amplify.github.io/docs/js/authentication

import { Auth } from 'aws-amplify';
import { RegistrationResult } from '../../models/cce/registration-result.model';
export const register = async (username, password, email, phone_number?): Promise<RegistrationResult> => {
  const result: RegistrationResult = {};
  const attributes = {
    email, // optional
    //  phone_number,   // optional - E.164 number convention
    // other custom attributes
  };
  if (phone_number) {
    attributes[phone_number] = phone_number;
  }
  try {
    const registerResult = await Auth.signUp({
      username,
      password,
      attributes,
      validationData: [], // optional
    });
    console.log('DEBUG register result ', JSON.stringify(registerResult));
  } catch (err) {
    console.log(err);
    result.errorMsg = err.message || 'Registration error';
  }
  return result;
  // Auth.signUp({
  //   username,
  //   password,
  //   attributes: {
  //     email,          // optional
  //     phone_number,   // optional - E.164 number convention
  //     // other custom attributes
  //   },
  //   validationData: []  // optional
  // })
  //   .then(data => console.log(data))
  //   .catch(err => console.log(err));
};

export const confirm = async (username, code) => {
  try {
    // After retrieving the confirmation code from the user
    const result = await Auth.confirmSignUp(username, code, {
      // Optional. Force user confirmation irrespective of existing alias. By default set to True.
      forceAliasCreation: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export const resend = async (username) => {
  try {
    const result = await Auth.resendSignUp(username);
  } catch (err) {
    console.log(err);
  }
};
