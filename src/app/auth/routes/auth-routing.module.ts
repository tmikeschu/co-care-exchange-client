import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasswordResetComponent } from '../components/password-reset/password-reset.component';
import { PasswordForgotComponent } from '../components/password-forgot/password-forgot.component';
import { ValidateEmailComponent } from '../components/validate-email/validate-email.component';
import { WelcomePageComponent } from '../components/welcome-page/welcome.component';
import { LoggedInRedirectGuard } from '../../core/guards/logged-in-redirect.guard';
import {ConfirmationComponent} from '../components/confirmation/confirmation.component';

const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomePageComponent, // SignInComponent,
    canActivate: [LoggedInRedirectGuard],
  },
  {
    path: 'passwordreset',
    component: PasswordResetComponent,
  },
  {
    path: 'passwordforgot',
    component: PasswordForgotComponent,
  },
  {
    path: 'validateemailaddress',
    component: ValidateEmailComponent,
  },
  {
    path: 'confirmregistration',
    component: ConfirmationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
