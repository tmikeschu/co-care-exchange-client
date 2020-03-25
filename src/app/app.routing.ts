import {RouterModule, Routes} from '@angular/router';

import {TopNavShellComponent} from './auth/top-nav-shell/top-nav-shell.component';
import {LoginShellComponent} from './auth/login-shell/login-shell.component';
import {PasswordResetComponent} from './auth/password-reset/password-reset.component';
import {PasswordForgotComponent} from './auth/password-forgot/password-forgot.component';
import {ValidateEmailComponent} from './auth/validate-email/validate-email.component';
import {SignInComponent} from './auth/sign-in/sign-in.component';
import {RegisterComponent} from './auth/register/register.component';
import {ContactUsComponent} from './contact-us/contact-us.component';
import {InformationComponent} from './information/information/information.component';
import {PromptComponent} from './prompt/prompt.component';
import {SummaryComponent} from './summary/summary.component';
import {CceHomeComponent} from './cce-home/cce-home.component';
import {PantryLocatorComponent} from './pantry-locator/pantry-locator.component'


const appRoutes: Routes = [
  {
    path: 'pantry',
    component: PantryLocatorComponent
  },
  {
    path: 'signIn',
    component: SignInComponent
  },
  {
    path: 'contact',
    component: ContactUsComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'info',
    component: InformationComponent
  },
  {
    path: 'prompt',
    component: PromptComponent
  },
  {
    path: 'summary',
    component: SummaryComponent
  },
  {
    path: 'ccehome',
    component: CceHomeComponent
  },
  {
    path: 'password-reset',
    component: PasswordResetComponent
  },
  {
    path: 'password-forgot',
    component: PasswordForgotComponent
  },
  {
    path: 'validateemailaddress',
    component: ValidateEmailComponent
  },
  {
    path: '',
    component: TopNavShellComponent,
    children: [
    ]
  },
  {
    path: '',
    component: LoginShellComponent,
    children: [
      // everything behind login goes here
    ]
  },
];

export const routing = RouterModule.forRoot(appRoutes, {
  enableTracing: false,
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled'
});
