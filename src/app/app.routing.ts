import { RouterModule, Routes } from '@angular/router';

import { TopNavShellComponent } from './auth/components/top-nav-shell/top-nav-shell.component';
import { LoginShellComponent } from './auth/components/login-shell/login-shell.component';
import { PasswordResetComponent } from './auth/components/password-reset/password-reset.component';
import { PasswordForgotComponent } from './auth/components/password-forgot/password-forgot.component';
import { ValidateEmailComponent } from './auth/components/validate-email/validate-email.component';
import { SignInComponent } from './auth/components/sign-in/sign-in.component';
import { RegisterComponent } from './registration/components/register/register.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { InformationComponent } from './information/information/information.component';
import { PromptComponent } from './prompt/prompt.component';
import { SummaryComponent } from './prompt/summary/summary.component';
import { DashboardComponent } from './dashboard/components/dashboard.component';
import { PantryLocatorComponent } from './pantry-locator/pantry-locator.component'
import { PersonalDashboardComponent } from './personal-dashboard/personal-dashboard.component'
import { ResourcesComponent } from './resources/resources.component'
import {ModuleWithProviders} from '@angular/core';
import { MetricsComponent } from './metrics/metrics.component'


const appRoutes: Routes = [
  {
    path: 'metrics',
    component: MetricsComponent
  },
  {
    path: 'resources',
    component: ResourcesComponent
  },
  {
    path: 'personaldashboard',
    component: PersonalDashboardComponent
  },
  {
    path: 'pantry',
    component: PantryLocatorComponent
  },
  {
    path: 'signin',
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
    path: 'passwordreset',
    component: PasswordResetComponent
  },
  {
    path: 'passwordforgot',
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
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
];


export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
// export const routing = RouterModule.forRoot(appRoutes, {
//   enableTracing: false,
//   scrollPositionRestoration: 'enabled',
//   anchorScrolling: 'enabled'
// });
