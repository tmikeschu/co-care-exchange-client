import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/cce/authentication.service';
import { RegistrationModel } from '../../models/cce/registrationModel';
import { InitialCreateInformation } from '../models/info-create.model';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent implements OnInit, AfterViewInit {
  @Input() email;
  @Input() firstName;
  @Input() lastName;
  @Input() organizationName;
  @Output() submit = new EventEmitter<InitialCreateInformation>();
  organizationForm: FormGroup;
  errorMessage: string;
  error = false;
  isRegistering = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.organizationForm = this.formBuilder.group({
      orgName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      deliveryOrPickupLocation: ['', Validators.required],
      deliveryOrPickupRadius: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.organizationForm.get('orgName').setValue(this.organizationName);
    this.organizationForm.get('email').setValue(this.email);
    this.organizationForm.get('firstName').setValue(this.firstName);
    this.organizationForm.get('lastName').setValue(this.lastName);
  }

  onRegisterSubmit() {
    this.organizationForm.disable();
    this.isRegistering = true;

    const registrationModel: RegistrationModel = {
      orgName: this.organizationForm.get('orgName').value,
      isOrganization: true,
      email: this.organizationForm.get('email').value,
      deliveryOrPickupLocation: this.organizationForm.get('deliveryOrPickupLocation').value,
      deliveryOrPickupRadius: this.organizationForm.get('deliveryOrPickupRadius').value,
      cityState: this.organizationForm.get('cityState').value,
      phone: this.organizationForm.get('phone').value,
    };

    console.log(registrationModel);
    // TODO
    const payload: InitialCreateInformation = { userInput: null };
    this.submit.emit(payload);

    // this.router.navigate(['/prompt']);

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
