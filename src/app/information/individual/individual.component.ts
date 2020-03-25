import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/cce/authentication.service';
import {RegistrationModel} from '../../models/cce/registrationModel';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss']
})
export class IndividualComponent implements OnInit {

  individualRegisterForm: FormGroup;
  errorMessage: string;
  error = false;
  isRegistering = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService) { }

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
      password: ['']
    });

  }

  async onRegisterSubmit() {
    this.individualRegisterForm.disable();
    this.isRegistering = true;

    const registrationModel: RegistrationModel = {
      firstName: this.individualRegisterForm.get('firstName').value,
      lastName: this.individualRegisterForm.get('lastName').value,
      isOrganization: false,
      email: this.individualRegisterForm.get('email').value,
      // password: this.registerForm.get('password').value,
      deliveryOrPickupLocation: this.individualRegisterForm.get('deliveryOrPickupLocation').value,
      deliveryOrPickupRadius: this.individualRegisterForm.get('deliveryOrPickupRadius').value,
      houseHoldSize: this.individualRegisterForm.get('householdSize').value,
      cityState: this.individualRegisterForm.get('cityState').value,
      phone: this.individualRegisterForm.get('phone').value,
    };

    console.log(registrationModel);

    const result = await this.authenticationService.register(registrationModel);
    if (result.errorMsg) {
      // todo handle error
    } else {
      this.router.navigate(['/prompt']);
    }

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
