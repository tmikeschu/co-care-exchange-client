import Amplify, { Auth } from 'aws-amplify';
import { individualsAWSInfo } from './individuals';
import { organizationCUPInfo } from './organizations';

export const configureAws = (name: string) => {
  console.log('DEBUG AWS CONFIG entry');
  // dev note: right now, just the CCE_Individual config is used for everything since groups are in the CUP as well
  const configs = { ...individualsAWSInfo, ...organizationCUPInfo };
  let config = configs[name];
  console.log('DEBUG using aws config ', config);
  if (!config) {
    // default to individuals
    config = individualsAWSInfo['CCE_Individual'];
  }
  Amplify.configure({
    Auth: {
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',

      // REQUIRED - Amazon Cognito Region
      region: config.region,

      // OPTIONAL - Amazon Cognito Federated Identity Pool Region
      // Required only if it's different from Amazon Cognito Region
      // identityPoolRegion: 'XX-XXXX-X',

      identityPoolId: config.identityPoolId,

      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: config.userPoolId,

      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: config.userPoolWebClientId,

      // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: false,

      // OPTIONAL - Configuration for cookie storage
      // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
      // cookieStorage: {
      //   // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      //   domain: '.yourdomain.com',
      //   // OPTIONAL - Cookie path
      //   path: '/',
      //   // OPTIONAL - Cookie expiration in days
      //   expires: 365,
      //   // OPTIONAL - Cookie secure flag
      //   // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
      //   secure: true
      // },

      // OPTIONAL - customized storage object
      // storage: new MyStorage(),

      // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
      authenticationFlowType: 'USER_PASSWORD_AUTH',

      // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
      // clientMetadata: { myCustomKey: 'myCustomValue' },

      // OPTIONAL - Hosted UI configuration
      // oauth: {
      //   domain: 'your_cognito_domain',
      //   scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      //   redirectSignIn: 'http://localhost:3000/',
      //   redirectSignOut: 'http://localhost:3000/',
      //   responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
      // }
    },
    Storage: {
      AWSS3: {
        bucket: 'care-exchange-images', //REQUIRED -  Amazon S3 bucket
        region: 'us-west-2', //OPTIONAL -  Amazon service region
      },
    },
  });
  Amplify.Logger.LOG_LEVEL = 'DEBUG';
};
