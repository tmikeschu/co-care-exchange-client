import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
    // TODO
  // {
  //   path: '',
  //   component: VerifyComponent,
  // },
  // {
  //   path: 'setup',
  //   component: AccountSetupComponent,
  //   canActivate: [AccountSetupGuard],
  // },
  // {
  //   path: 'confirm',
  //   component: AccountConfirmationComponent,
  //   canActivate: [AccountSetupGuard],
  // },
  // {
  //   path: 'register',
  //   component: RegisterComponent
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationRoutingModule {}
