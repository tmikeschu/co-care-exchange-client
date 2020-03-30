import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/cce/authentication.service';
import { NavbarService } from '../../../services/navbar.service';
import { SignInResult } from '../../../models/cce/sign-in-result.model';
import { UserService } from '../../../core/services/user.service';
import { OrganizationService } from '../../../core/services/organization.service';
import { defer, Observable } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  INDIVIDUAL = { name: 'Individual', id: null };
  loginForm: FormGroup;
  errorMessage: string;
  error = false;
  signingIn = false;
  organizations = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private orgService: OrganizationService,
    private navbarService: NavbarService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      organization: [''],
    });
    this.route.queryParams.subscribe((val) => {
      console.log('DEBUG signin email ', val);
      const email = val.email;
      if (email) {
        this.loginForm.get('username').setValue(email);
      }
    });
    this.orgService.getOrganizations().subscribe((orgs) => {
      const orgList = [...orgs];
      orgList.unshift(this.INDIVIDUAL);
      this.organizations = orgList;
    });
  }

  async onLoginSubmit() {
    this.error = false;
    this.errorMessage = undefined;
    this.signingIn = true;
    // this.loginForm.disable();
    console.log('DEBUG signin org ', this.loginForm.get('organization').value);
    let org = this.loginForm.get('organization').value;
    // if org is the individual, then no org
    if (!org.id) {
      org = null;
    }
    try {
      const result: SignInResult = await this.authenticationService.signIn(
        this.loginForm.get('username').value,
        this.loginForm.get('password').value,
        org
      );
      console.log('DEBUG: signin result ', result);
      this.signingIn = false;
      if (result.errorMsg) {
        this.error = true;
        this.errorMessage = result.errorMsg;
        // todo: handle errors
        alert(result.errorMsg);
        return;
      }
      // TODO is navbar service needed...dont think so
      this.navbarService.setLogin(true);
      await this.navigateToNextRoute();
    } catch (err) {
      console.log('SignIn error ', err);
      alert('Error signing in, try again later');
    }
    // this.authenticationService.login(this.loginForm.get('username').value, this.loginForm.get('password').value)
    //   .pipe(first())
    //   .subscribe((val) => {
    //       this.navbarService.setLogin(true);
    //       this.signingIn = false;
    //     },
    //     (error: string) => {
    //       if (error === 'Please verify your account before logging in.  ' +
    //         'You should have received a verification email when you registered') {
    //         this.errorMessage = error;
    //       }
    //       this.error = true;
    //       this.signingIn = false;
    //     });
  }

  private async navigateToNextRoute() {
    // TODO -- check if user profile exists
    const self = this;
    defer(async function () {
      return await self.userService.getUser('scarlet@dfb.org');
    }).subscribe((user) => {
      console.log('DEBUG user profile ', user);
      if (user) {
        return this.router.navigate(['/', 'dashboard']);
      } else {
        return this.router.navigate(['/', 'info']);
      }
    });

    //  return await this.router.navigate(['/', 'dashboard']);
    // if so , nav to dashboard, else
  }

  handleForgotPW() {
    this.router.navigate(['/passwordforgot']);
  }

  handleRegistration() {
    this.router.navigate(['/register']);
  }

  handlePantry() {
    this.router.navigate(['/pantry']);
  }
}
