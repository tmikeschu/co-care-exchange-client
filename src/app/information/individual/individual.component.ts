import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/cce/authentication.service';
import { RegistrationModel } from '../../models/cce/registrationModel';
import {CreateUserInput} from '../../graphql/models/create-user-input.model';
import {InitialCreateInformation} from '../models/info-create.model';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss'],
})
export class IndividualComponent implements OnInit, AfterViewInit {
  @Input() firstName;
  @Input() lastName;
  @Input() email;
  @Output() submit = new EventEmitter<InitialCreateInformation>();

  individualRegisterForm: FormGroup;
  errorMessage: string;
  error = false;
  isRegistering = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.individualRegisterForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      householdSize: ['', Validators.required],
      cityState: ['', Validators.required],
      deliveryOrPickupLocation: ['', Validators.required],
      deliveryOrPickupRadius: ['', Validators.required],
      // password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]]
      password: [''],
    });
  }

  ngAfterViewInit(): void {
    this.individualRegisterForm.get('firstName').setValue(this.firstName);
    this.individualRegisterForm.get('lastName').setValue(this.lastName);
    this.individualRegisterForm.get('email').setValue(this.email);
  }

  async onRegisterSubmit() {
    this.individualRegisterForm.disable();
    this.isRegistering = true;

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

    //TEST
    const profile: CreateUserInput = {
      address: '123 Main',
      city: 'Parker',
      dropOffRadius: this.individualRegisterForm.get('deliveryOrPickupRadius').value,
      emailAddress: this.individualRegisterForm.get('email').value,
      firstName:  this.individualRegisterForm.get('firstName').value,
      lastName: this.individualRegisterForm.get('lastName').value,
      pickupRadius: this.individualRegisterForm.get('deliveryOrPickupRadius').value,
      state: 'CO',
      postalCode: '80134',
      phoneNumber: this.individualRegisterForm.get('phone').value,
      createdBy: this.individualRegisterForm.get('email').value,
    };
   // this.userService.saveUser(profile).subscribe(x => console.log(x));

    console.log(profile);

    const payload: InitialCreateInformation = {userInput: profile };
    this.submit.emit(payload);

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
