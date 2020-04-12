import { RouterModule, Routes } from '@angular/router';
import { LoginShellComponent } from './auth/components/login-shell/login-shell.component';
import { SignInComponent } from './auth/components/sign-in/sign-in.component';
import { RegisterComponent } from './registration/components/register/register.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DashboardComponent } from './dashboard/components/dashboard.component';
import { PantryLocatorComponent } from './pantry-locator/pantry-locator.component';
import { PersonalDashboardComponent } from './personal-dashboard/personal-dashboard.component';
import { ResourcesComponent } from './resources/resources.component';
import { ModuleWithProviders } from '@angular/core';
import { UserResolver } from './core/resolvers/user.resolver';
import { AppComponent } from './app.component';
import { PromptsComponent } from './prompts/prompts/prompts.component';
import {InformationComponent} from './information/information/information.component';

export const appRoutes: Routes = [
  // {
  //   path: 'metrics',
  //   component: MetricsComponent
  // },
  // {
  //   path: 'resources',
  //   component: ResourcesComponent,
  // },
  // {
  //   path: 'personaldashboard',
  //   component: PersonalDashboardComponent,
  // },
  // {
  //   path: 'pantry',
  //   component: PantryLocatorComponent,
  // },
  // {
  //   path: 'signin',
  //   component: SignInComponent,
  // },
  // {
  //   path: 'contact',
  //   component: ContactUsComponent,
  // },
  // {
  //   path: 'register',
  //   component: RegisterComponent,
  // },
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent,
  //   // TODO -- auth guard
  // },
  // {
  //   path: 'info',
  //   component: InformationComponent
  // },
  // {
  //   path: 'prompt',
  //   component: PromptComponent
  // },
  // {
  //   path: 'summary',
  //   component: SummaryComponent
  // },
  // {
  //   path: 'passwordreset',
  //   component: PasswordResetComponent
  // },
  // {
  //   path: 'passwordforgot',
  //   component: PasswordForgotComponent
  // },
  // {
  //   path: 'validateemailaddress',
  //   component: ValidateEmailComponent
  // },
  // {
  //   path: '',
  //   component: TopNavShellComponent,
  //   children: [
  //   ]
  // },
  {
    path: '',
    component: AppComponent,
    children: [
      // everything behind login goes here
      {
        path: 'resources',
        component: ResourcesComponent,
      },
      {
        path: 'personaldashboard',
        component: PersonalDashboardComponent,
        resolve: { user: UserResolver },
      },
      {
        path: 'pantry',
        component: PantryLocatorComponent,
      },
      {
        path: 'signin',
        component: SignInComponent,
      },
      {
        path: 'contact',
        component: ContactUsComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        resolve: { user: UserResolver },
      },
      {
        path: 'prompt',
        component: PromptsComponent,
        resolve: { user: UserResolver },
      },
      {
        path: 'info',
        component: InformationComponent,
        resolve: { user: UserResolver },
      },
      {
        path: '**',
        redirectTo: '/',
        pathMatch: 'full',
      },
    ],
   // resolve: { user: UserResolver },
  },
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes, {paramsInheritanceStrategy: 'always'});
// export const AppRouting = RouterModule.forRoot(appRoutes, {
//   enableTracing: false,
//   scrollPositionRestoration: 'enabled',
//   anchorScrolling: 'enabled'
// });
