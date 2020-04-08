import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service'
import { SaveUserInput } from '../../graphql/models/save-user-input.model';
import { UserProfileInformation } from '../models/info-create.model';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss'],
})
export class IndividualComponent implements OnInit, AfterContentInit {
  @Input() firstName;
  @Input() lastName;
  @Input() email;
  @Output() infoSubmit = new EventEmitter<UserProfileInformation>();

  individualRegisterForm: FormGroup;
  errorMessage: string;
  error = false;
  private _isRegistering = false;
  userProfile

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

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

  radiusOptions = [
    { id: 1, name: '1 Mile' },
    { id: 5, name: '5 Miles' },
    { id: 10, name: '10 Miles' },
    { id: 15, name: '15 Miles' },
    { id: 20, name: '20 Miles' },
    { id: 25, name: '25 Miles' },
    { id: 50, name: '50+ Miles' },
  ];

  get isRegistering() {
    return this._isRegistering;
  }

  ngOnInit() {

  }

  async ngAfterContentInit() {

    this.userProfile = await this.userService.getUser(this.email).pipe(first()).toPromise();

    this.individualRegisterForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      householdSize: [0, Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      deliveryOrPickupRadius: ['', Validators.required],
      password: [''],
    });

    this.individualRegisterForm.get('firstName').setValue(this.firstName);
    this.individualRegisterForm.get('lastName').setValue(this.lastName);
    this.individualRegisterForm.get('email').setValue(this.email);

    if (this.userProfile) {
      this.individualRegisterForm.get('phone').setValue(this.userProfile.phoneNumber || '');
      this.individualRegisterForm.get('address').setValue(this.userProfile.address || '');
      this.individualRegisterForm.get('city').setValue(this.userProfile.city || '');
      this.individualRegisterForm.get('state').setValue(this.userProfile.state || '');
      this.individualRegisterForm.get('postalCode').setValue(this.userProfile.postalCode || '');
      this.individualRegisterForm.get('deliveryOrPickupRadius').setValue(this.userProfile.dropOffRadius || 50);
      this.individualRegisterForm.get('householdSize').setValue(this.userProfile.householdSize || 0);
    }
  }

  async onRegisterSubmit() {

    const profile: SaveUserInput = {
      address: this.individualRegisterForm.get('address').value,
      city: this.individualRegisterForm.get('city').value,
      dropOffRadius: this.individualRegisterForm.get('deliveryOrPickupRadius').value,
      emailAddress: this.email,
      currentUserEmail: this.email,
      firstName: this.individualRegisterForm.get('firstName').value,
      lastName: this.individualRegisterForm.get('lastName').value,
      pickupRadius: this.individualRegisterForm.get('deliveryOrPickupRadius').value,
      state: this.individualRegisterForm.get('state').value,
      postalCode: this.individualRegisterForm.get('postalCode').value,
      phoneNumber: this.individualRegisterForm.get('phone').value,
    };
    // this.userService.saveUser(profile).subscribe(x => console.log(x));

    if (!this._isRegistering && this.userProfile) {
      profile.userId = this.userProfile.id
    }

    console.log(profile);

    const payload: UserProfileInformation = { userInput: profile };
    this.infoSubmit.emit(payload);
  }
}
