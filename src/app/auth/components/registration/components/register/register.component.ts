import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../../../../../core/services/cce/authentication.service';
import { BasicRegistrationModel } from '../../../../../models/cce/basic-registration.model';
import { environment } from '../../../../../../environments/environment';
import { OrganizationService } from 'src/app/core/services/organization.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string;
  error = false;
  isRegistering = false;
  organizations = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
    private orgService: OrganizationService,
  ) { }

  ngOnInit() {
    const minPasswordLength = environment.passwordPolicy.minLength || 8;
    
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(minPasswordLength), Validators.maxLength(30)]],
      organization: [''],
    });

    this.orgService.getOrganizations$().subscribe((orgs) => {
      const orgList = [...orgs];      
      this.organizations = orgList;
    });
  }

  handlePantry() {
    this.router.navigate(['/pantry']);
  }

  async onRegisterSubmit() {
    this.registerForm.disable();
    this.isRegistering = true;
    const email = this.registerForm.get('email').value;
     

    try {
      const regModel: BasicRegistrationModel = {
        email,
        password: this.registerForm.get('password').value,
        firstName: this.registerForm.get('firstName').value,
        lastName: this.registerForm.get('lastName').value,
        organization: this.registerForm.get('organization').value
      };

      const result = await this.authenticationService.register(regModel);

      if (result.errorMsg) {
        this.toastrService.error(result.errorMsg, null, {
          positionClass: "toast-top-center"
        });
        return;
      }

      this.toastrService.success('Please check your email for a verification and then complete signin', null, {
        timeOut: 0,
        extendedTimeOut: 0,
        positionClass: "toast-top-center"
      });

      this.router.navigate(['/', 'welcome'], { queryParams: { email: email } });

    } catch (err) {
      console.error(err);
      this.toastrService.error('An unexpected error has occurred. Please try again later.', null, {
        positionClass: "toast-top-center"
      });
    } finally {
      this.registerForm.enable();
      this.isRegistering = false;
    }
  }
}
