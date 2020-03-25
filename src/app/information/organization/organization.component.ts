import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/cce/authentication.service';
import {RegistrationModel} from '../../models/cce/registrationModel';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  organizationForm: FormGroup;
  errorMessage: string;
  error = false;
  isRegistering = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.organizationForm = this.formBuilder.group({
      orgName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      cityState: ['', Validators.required],
      deliveryOrPickupLocation: ['', Validators.required],
      deliveryOrPickupRadius: ['', Validators.required],
    });

  }

  onRegisterSubmit() {
    this.organizationForm.disable();
    this.isRegistering = true;

    const registrationModel: RegistrationModel = {
      orgName: this.organizationForm.get('orgName').value,
      isOrganization: true,
      email: this.organizationForm.get('email').value,
      // password: this.registerForm.get('password').value,
      deliveryOrPickupLocation: this.organizationForm.get('deliveryOrPickupLocation').value,
      deliveryOrPickupRadius: this.organizationForm.get('deliveryOrPickupRadius').value,
      cityState: this.organizationForm.get('cityState').value,
      phone: this.organizationForm.get('phone').value,
    };

    console.log(registrationModel);

    this.router.navigate(['/prompt']);

    // uncomment this out when services are in place
    // this.authenticationService.register(registrationModel)
    //   .subscribe(() => {
    //       this.router.navigate(['/signIn']);
    //       this.isRegistering = false;
    //     },
    //     error => {
    //       alert(error);
    //     });
  }


}
