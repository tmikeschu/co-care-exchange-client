import { CUPMap } from './cup-info.model';

// dev note: should eventually be dynamic (load from web, or maybe move the env (but that is build time so no better than here)
export const organizationCUPInfo: CUPMap = {
  'United Way': {
    region: 'us-west-2',
    userPoolId: 'us-west-2_pwBfmHN7X',
    userPoolWebClientId: '139mnaeir0mttnmghje3g3m6so',
  },
  'Food Bank': {
    region: 'us-west-2',
    userPoolId: 'TBD',
    userPoolWebClientId: 'TBD',
  },
};
