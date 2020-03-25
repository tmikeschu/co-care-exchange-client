export interface CUPInfo {
  region: string;
  userPoolId: string;
  userPoolWebClientId: string;
}

export interface CUPMap {
  [key: string]: CUPInfo;
}
