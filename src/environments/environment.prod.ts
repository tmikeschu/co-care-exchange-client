import { commonEnv } from './commonEnv';
import { awsEnv } from './awsEnv.prod';

export const environment = {
  ...commonEnv,
  ...awsEnv,
  // the real prod envs should go here
  serverUrl: 'https://dev-api.cocareexchange.org/graphql',
  apiKey: 'zPrRE3Fjmz5mZ1sFQxoRY1qtGRxTM5f41Wu4GdiU',
  // serverUrl: 'https://api.cocareexchange.org/graphql',
  // apiKey: 'ClCInL23rFaCf5pbrQc028dkXSUur8NMavQedzur',
  production: true,
};
