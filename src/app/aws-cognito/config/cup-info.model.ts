export interface CUPInfo {
  region: string;
  userPoolId: string;
  userPoolWebClientId: string;
  identityPoolId?: string;
}

export interface CUPMap {
  [key: string]: CUPInfo;
}
