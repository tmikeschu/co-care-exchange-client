import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './material/material.module';
import { SharedModule } from './shared/shared.module';
import { GreetingService } from './services/greeting.service';
import { TopNavShellComponent } from './auth/top-nav-shell/top-nav-shell.component';
import { LoginShellComponent } from './auth/login-shell/login-shell.component';
import { MatNavComponent } from './mat-nav/mat-nav.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { PasswordForgotComponent } from './auth/password-forgot/password-forgot.component';
import { RouterModule, Routes } from '@angular/router';
import { NavbarService } from './services/navbar.service';
import { ToastrModule } from 'ngx-toastr';
import { ValidateEmailComponent } from './auth/validate-email/validate-email.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { RegisterComponent } from './auth/register/register.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { InformationModule } from './information/information.module';
import { PromptModule } from './prompt/prompt.module';
import { AwsCognitoModule } from './aws-cognito/aws-cognito.module';
import { SummaryComponent } from './prompt/summary/summary.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PantryLocatorModule } from './pantry-locator/pantry-locator.module';
import { StatusDialogComponent } from './dashboard/status-dialog/status-dialog.component';

const appRoutes: Routes = [
  { path: 'password-forgot', component: PasswordForgotComponent },
];


@NgModule({
  imports: [
    BrowserModule,
    PantryLocatorModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    ToastrModule,
    routing,
    SharedModule,
    InformationModule,
    AwsCognitoModule,
    PromptModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    // NgxStripeModule.forRoot('pk_test_YnfmX19Af1lUde9Aopuc4fsD0020Mzmc6U'),
    ToastrModule.forRoot(),
    LayoutModule
  ],
  declarations: [
    AppComponent,
    TopNavShellComponent,
    LoginShellComponent,
    PasswordResetComponent,
    PasswordForgotComponent,
    ValidateEmailComponent,
    SignInComponent,
    RegisterComponent,
    MatNavComponent,
    ContactUsComponent,
    SummaryComponent,
    DashboardComponent,
    StatusDialogComponent
  ],
  providers: [
    GreetingService,
    NavbarService,
    // StripeService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  exports: [
  ],
  entryComponents: [StatusDialogComponent],
  bootstrap: [AppComponent]
})

export class AppModule {
}
