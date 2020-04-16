import { commonEnv } from './commonEnv';
import { awsEnv } from './awsEnv.qa';

export const environment = {
  ...commonEnv,
  ...awsEnv,
  // TODO -- verify this is the dev instance
  serverUrl: 'https://dev-api.cocareexchange.org/graphql?',
  apiKey: 'zPrRE3Fjmz5mZ1sFQxoRY1qtGRxTM5f41Wu4GdiU',
  production: true,
};
