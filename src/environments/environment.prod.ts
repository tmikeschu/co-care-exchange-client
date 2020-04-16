import { commonEnv } from './commonEnv';
import { awsEnv } from './awsEnv.prod';

export const environment = {
  ...commonEnv,
  ...awsEnv,
  // the real prod envs should go here
  serverUrl: 'https://api.cocareexchange.org/graphql?',
  apiKey: 'ClCInL23rFaCf5pbrQc028dkXSUur8NMavQedzur',
  production: true,
};
