import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './material/material.module';
import { SharedModule } from './shared/shared.module';
import { GreetingService } from './services/greeting.service';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { RouterModule, Routes } from '@angular/router';
import { NavbarService } from './services/navbar.service';
import { ToastrModule } from 'ngx-toastr';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { InformationModule } from './information/information.module';
import { PromptModule } from './prompt/prompt.module';
import { AwsCognitoModule } from './aws-cognito/aws-cognito.module';
import { SummaryComponent } from './prompt/summary/summary.component';
import { PantryLocatorModule } from './pantry-locator/pantry-locator.module';
import { PersonalDashboardComponent } from './personal-dashboard/personal-dashboard.component';
import { ResourcesComponent } from './resources/resources.component';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/AuthModule';
import { DashboardModule } from './dashboard/DashboardModule';
import {RegistrationModule} from './registration/registration.module';

// const appRoutes: Routes = [
//   { path: 'passwordforgot', component: PasswordForgotComponent },
// ];

@NgModule({
  imports: [
    BrowserModule,
    AppRouting,
    CoreModule,
    AuthModule,
    RegistrationModule,
    DashboardModule,
    PantryLocatorModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    ToastrModule,
    SharedModule,
    InformationModule,
    AwsCognitoModule,
    PromptModule,
    // RouterModule.forRoot(
    //   appRoutes,
    //   { enableTracing: false } // <-- debugging purposes only
    // ),
    // NgxStripeModule.forRoot('pk_test_YnfmX19Af1lUde9Aopuc4fsD0020Mzmc6U'),
    ToastrModule.forRoot(),
    LayoutModule,
  ],
  declarations: [
    AppComponent,
    ContactUsComponent,
    SummaryComponent,
    PersonalDashboardComponent,
    ResourcesComponent,
  ],
  providers: [
    GreetingService,
    NavbarService,
    // StripeService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
