import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './auth/components/sign-in/sign-in.component';
import { RegisterComponent } from './auth/components/registration/components/register/register.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DashboardComponent } from './dashboard/components/dashboard.component';
import { PantryLocatorComponent } from './pantry-locator/pantry-locator.component';
import { AccountComponent } from './account/account.component';
import { ResourcesComponent } from './resources/resources.component';
import { ModuleWithProviders } from '@angular/core';
import { UserResolver } from './core/resolvers/user.resolver';
import { AppComponent } from './app.component';
import { PromptsComponent } from './prompts/prompts/prompts.component';
import { InformationComponent } from './information/information/information.component';

export const appRoutes: Routes = [
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
        path: 'account',
        component: AccountComponent,
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
  },
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes, { paramsInheritanceStrategy: 'always' });
