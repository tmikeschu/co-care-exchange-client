import { RouterModule, Routes } from '@angular/router';

import { TopNavShellComponent } from './auth/top-nav-shell/top-nav-shell.component';
import { LoginShellComponent } from './auth/login-shell/login-shell.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { PasswordForgotComponent } from './auth/password-forgot/password-forgot.component';
import { ValidateEmailComponent } from './auth/validate-email/validate-email.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { RegisterComponent } from './auth/register/register.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { InformationComponent } from './information/information/information.component';
import { PromptComponent } from './prompt/prompt.component';
import { SummaryComponent } from './prompt/summary/summary.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PantryLocatorComponent } from './pantry-locator/pantry-locator.component'
import { PersonalDashboardComponent } from './personal-dashboard/personal-dashboard.component'
import { ResourcesComponent } from './resources/resources.component'


const appRoutes: Routes = [
  {
    path: 'resources',
    component: ResourcesComponent
  },
  {
    path: 'personal-dashboard',
    component: PersonalDashboardComponent
  },
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
    path: 'dashboard',
    component: DashboardComponent
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
