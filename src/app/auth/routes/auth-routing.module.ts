import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from '../components/sign-in/sign-in.component';
import { PasswordResetComponent } from '../components/password-reset/password-reset.component';
import { PasswordForgotComponent } from '../components/password-forgot/password-forgot.component';
import { ValidateEmailComponent } from '../components/validate-email/validate-email.component';
import { WelcomePageComponent } from '../components/welcome-page/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent,
  },
  {
    path: 'welcome',
    component: WelcomePageComponent,
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
