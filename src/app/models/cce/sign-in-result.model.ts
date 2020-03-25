export interface SignInResult {
  user?: any; // dev note: used any to keep Cognito out of the interface...for now...CognitoUser
  errorMsg?: string;
}
