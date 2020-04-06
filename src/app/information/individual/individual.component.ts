import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/cce/authentication.service';
import { RegistrationModel } from '../../models/cce/registrationModel';
import { CreateUserInput } from '../../graphql/models/user-input.model';
import { InitialCreateInformation } from '../models/info-create.model';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss'],
})
export class IndividualComponent implements OnInit, AfterViewInit {
  @Input() firstName;
  @Input() lastName;
  @Input() email;
  @Output() infoSubmit = new EventEmitter<InitialCreateInformation>();

  individualRegisterForm: FormGroup;
  errorMessage: string;
  error = false;
  private _isRegistering = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.individualRegisterForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      householdSize: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      deliveryOrPickupLocation: ['', Validators.required],
      // deliveryOrPickupRadius: [0, Validators.compose([Validators.min(1), Validators.max(50)])],
      password: [''],
    });

     this.selectedRadius = this.radiusOptions[0].id; 
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

  selectedRadius = 0;

  ngAfterViewInit(): void {
    this.individualRegisterForm.get('firstName').setValue(this.firstName);
    this.individualRegisterForm.get('lastName').setValue(this.lastName);
    this.individualRegisterForm.get('email').setValue(this.email);
  }

  @Input()
  set isRegistering(state: boolean) {
    console.log('DEBUG org isRegistering ', state);
    this._isRegistering = state;
    if (!this.individualRegisterForm) {
      return;
    }
    if (this._isRegistering) {
      this.individualRegisterForm.disable();
    } else {
      this.individualRegisterForm.enable();
    }
  }

  get isRegistering() {
    return this._isRegistering;
  }

  async onRegisterSubmit() {
    // reconcile these models
    // const registrationModel: RegistrationModel = {
    //   firstName: this.individualRegisterForm.get('firstName').value,
    //   lastName: this.individualRegisterForm.get('lastName').value,
    //   isOrganization: false,
    //   email: this.individualRegisterForm.get('email').value,
    //   // password: this.registerForm.get('password').value,
    //   deliveryOrPickupLocation: this.individualRegisterForm.get('deliveryOrPickupLocation').value,
    //   deliveryOrPickupRadius: this.individualRegisterForm.get('deliveryOrPickupRadius').value,
    //   houseHoldSize: this.individualRegisterForm.get('householdSize').value,
    //   cityState: this.individualRegisterForm.get('cityState').value,
    //   phone: this.individualRegisterForm.get('phone').value,
    // };

    // TEST
    const profile: CreateUserInput = {
      address: this.individualRegisterForm.get('deliveryOrPickupLocation').value,
      city: this.individualRegisterForm.get('city').value,
      dropOffRadius: this.selectedRadius,
      emailAddress: this.individualRegisterForm.get('email').value,
      firstName: this.individualRegisterForm.get('firstName').value,
      lastName: this.individualRegisterForm.get('lastName').value,
      pickupRadius: this.selectedRadius,
      state: this.individualRegisterForm.get('state').value,
      postalCode: this.individualRegisterForm.get('postalCode').value,
      phoneNumber: this.individualRegisterForm.get('phone').value,
      // createdBy: this.individualRegisterForm.get('email').value,
    };
    // this.userService.saveUser(profile).subscribe(x => console.log(x));

    console.log(profile);

    const payload: InitialCreateInformation = { userInput: profile };
    this.infoSubmit.emit(payload);

    // const result = await this.authenticationService.register(registrationModel);
    // if (result.errorMsg) {
    //   // todo handle error
    // } else {
    // this.router.navigate(['/prompt']);
    // }

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
