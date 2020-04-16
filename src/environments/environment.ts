// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { commonEnv } from './commonEnv';
import { awsEnv } from './awsEnv.qa';

export const environment = {
  ...commonEnv,
  ...awsEnv,
  serverUrl: 'https://api.cocareexchange.org/graphql?',
  apiKey: 'zPrRE3Fjmz5mZ1sFQxoRY1qtGRxTM5f41Wu4GdiU',
  production: false,
};
