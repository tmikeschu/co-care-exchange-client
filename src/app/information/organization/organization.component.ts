import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/cce/authentication.service';
import { InitialCreateInformation } from '../models/info-create.model';
import { CreateUserInput } from '../../graphql/models/create-user-input.model';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent implements OnInit, AfterContentInit {
  @Input() email;
  @Input() firstName;
  @Input() lastName;
  @Input() organizationName;
  @Input() organizationId;
  @Output() infoSubmit = new EventEmitter<InitialCreateInformation>();
  organizationForm: FormGroup;
  errorMessage: string;
  error = false;
  private _isRegistering = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private authenticationService: AuthenticationService) {}

  @Input()
  set isRegistering(state: boolean) {
    console.log('DEBUG org isRegistering ', state);
    this._isRegistering = state;
    if (!this.organizationForm) {
      return;
    }
    if (this._isRegistering) {
      this.organizationForm.disable();
    } else {
      this.organizationForm.enable();
    }
  }

  get isRegistering() {
    return this._isRegistering;
  }

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
      deliveryOrPickupRadius: [0, Validators.compose([Validators.min(1), Validators.max(50)])],
    });
  }

  radiusOptions = [
    {id: 1, name: '1 Mile'},
    {id: 5, name: '5 Miles'},
    {id: 10, name: '10 Miles'},
    {id: 15, name: '15 Miles'},
    {id: 20, name: '20 Miles'},
    {id: 25, name: '25 Miles'},
    {id: 50, name: '50+ Miles'},
  ];

  ngAfterContentInit(): void {
    this.organizationForm.get('orgName').setValue(this.organizationName);
    this.organizationForm.get('email').setValue(this.email);
    this.organizationForm.get('firstName').setValue(this.firstName);
    this.organizationForm.get('lastName').setValue(this.lastName);
  }

  onRegisterSubmit() {
    // this.isRegistering = true;

    // const registrationModel: RegistrationModel = {
    //   orgName: this.organizationForm.get('orgName').value,
    //   isOrganization: true,
    //   email: this.organizationForm.get('email').value,
    //   deliveryOrPickupLocation: this.organizationForm.get('deliveryOrPickupLocation').value,
    //   deliveryOrPickupRadius: this.organizationForm.get('deliveryOrPickupRadius').value,
    //   cityState: this.organizationForm.get('cityState').value,
    //   phone: this.organizationForm.get('phone').value,
    // };

    const profile: CreateUserInput = {
      address: this.organizationForm.get('deliveryOrPickupLocation').value,
      city: this.organizationForm.get('city').value,
      dropOffRadius: this.organizationForm.get('deliveryOrPickupRadius').value,
      emailAddress: this.organizationForm.get('email').value,
      firstName: this.organizationForm.get('firstName').value,
      lastName: this.organizationForm.get('lastName').value,
      pickupRadius: this.organizationForm.get('deliveryOrPickupRadius').value,
      state: this.organizationForm.get('state').value,
      postalCode: this.organizationForm.get('postalCode').value,
      phoneNumber: this.organizationForm.get('phone').value,
      createdBy: this.organizationForm.get('email').value,
      organizationId: this.organizationId,
    };

    console.log(profile);
    const payload: InitialCreateInformation = { userInput: profile };
    this.infoSubmit.emit(payload);

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
