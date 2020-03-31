import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PasswordForgotComponent } from './components/password-forgot/password-forgot.component';
import { LoginShellComponent } from './components/login-shell/login-shell.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { TopNavShellComponent } from './components/top-nav-shell/top-nav-shell.component';
import { ValidateEmailComponent } from './components/validate-email/validate-email.component';
import { SharedModule } from '../shared/shared.module';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatProgressBarModule, MatProgressSpinnerModule,
} from '@angular/material';
import { AuthRoutingModule } from './routes/auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CustomMaterialModule} from '../material/material.module';

@NgModule({
  declarations: [
    LoginShellComponent,
    PasswordForgotComponent,
    PasswordResetComponent,
    SignInComponent,
    TopNavShellComponent,
    ValidateEmailComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule
  ],
})
export class AuthModule {}
