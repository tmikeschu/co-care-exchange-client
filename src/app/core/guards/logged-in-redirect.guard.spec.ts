import { TestBed, async, inject } from '@angular/core/testing';

import { LoggedInRedirectGuard } from './logged-in-redirect.guard';

describe('LoggedInRedirectGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggedInRedirectGuard]
    });
  });

  it('should ...', inject([LoggedInRedirectGuard], (guard: LoggedInRedirectGuard) => {
    expect(guard).toBeTruthy();
  }));
});
