import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from '../components/sign-in/sign-in.component';

const routes: Routes = [
  {
    path: '',
    component: SignInComponent,
  },
  // {
  //   path: 'register',
  //   component: RegisterComponent
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
