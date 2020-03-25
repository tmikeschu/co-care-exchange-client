import { AwsCognitoModule } from './aws-cognito.module';

describe('AwsCognitoModule', () => {
  let awsCognitoModule: AwsCognitoModule;

  beforeEach(() => {
    awsCognitoModule = new AwsCognitoModule();
  });

  it('should create an instance', () => {
    expect(awsCognitoModule).toBeTruthy();
  });
});
