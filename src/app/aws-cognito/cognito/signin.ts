import { Auth } from 'aws-amplify';
import { SignInResult } from '../../models/cce/sign-in-result.model';

export const signIn = async (username, password, organization?) => {
  const result: SignInResult = {};
  try {
    let user = null;
    if (organization) {
      const clientMetadata = { organization: organization.name };
      user = await Auth.signIn(username, password, clientMetadata);
    } else {
      user = await Auth.signIn(username, password);
    }
    result.user = user;
    if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
      // todo: support MFA...for now, it's an error
      result.errorMsg = 'MFA not supported';
      // You need to get the code from the UI inputs
      // and then trigger the following function with a button click
      // const code = getCodeFromUserInput();
      // // If MFA is enabled, sign-in should be confirmed with the confirmation code
      // const loggedUser = await Auth.confirmSignIn(
      //   user,   // Return object from Auth.signIn()
      //   code,   // Confirmation code
      //   mfaType // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
      // );
    } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
      const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
      // You need to get the new password and required attributes from the UI inputs
      // and then trigger the following function with a button click
      // For example, the email and phone_number are required attributes

      result.errorMsg = 'New Password Required';
      // const {username, email, phone_number} = getInfoFromUserInput();
      // const loggedUser = await Auth.completeNewPassword(
      //   user,              // the Cognito User Object
      //   newPassword,       // the new password
      //   // OPTIONAL, the required attributes
      //   {
      //     email,
      //     phone_number,
      //   }
      // );
    } else if (user.challengeName === 'MFA_SETUP') {
      result.errorMsg = 'MFA not supported';
      // This happens when the MFA method is TOTP
      // The user needs to setup the TOTP before using it
      // More info please check the Enabling MFA part
      // Auth.setupTOTP(user);
    } else {
      // The user directly signs in
      console.log('DEBUG signin user ', user);
      // let user = await Auth.currentAuthenticatedUser();
    }
    return result;
  } catch (err) {
    console.log(err);
    result.errorMsg = err.message || err.code || 'UnknownException';
    // dev note: boilerplate code, not sure if we want to sdo any special handling here...leaving for now
    if (err.code === 'UserNotConfirmedException') {
      // The error happens if the user didn't finish the confirmation step when signing up
      // In this case you need to resend the code and confirm the user
      // About how to resend the code and confirm the user, please check the signUp part
    } else if (err.code === 'PasswordResetRequiredException') {
      // The error happens when the password is reset in the Cognito console
      // In this case you need to call forgotPassword to reset the password
      // Please check the Forgot Password part.
    } else if (err.code === 'NotAuthorizedException') {
      // The error happens when the incorrect password is provided
    } else if (err.code === 'UserNotFoundException') {
      // The error happens when the supplied username/email does not exist in the Cognito user pool
    } else {
      console.log(err);
    }
    return result;
  }
};

export const confirmSignIn = async (user: unknown, code: string) => {};

export const completeNewPassword = async (newPassword: string) => {};
