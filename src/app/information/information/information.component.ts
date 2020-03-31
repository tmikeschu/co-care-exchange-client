import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/cce/authentication.service';
import { UserService } from '../../core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InitialCreateInformation } from '../models/info-create.model';

@Component({
  selector: 'app-register',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
})
export class InformationComponent implements OnInit {
  registrantType: string;
  newUser = false;
  organizationName = null;
  organizationId = null;
  error = false;

  isRegistering = false;

  // TODO -- combine the authservice user stuff with user service
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.registrantType = 'Individual';
    // this.orgService.getOrganizations$().subscribe((orgs) => console.log(orgs));
    this.route.queryParams.subscribe((val) => {
      console.log('DEBUG info newuser, org ', val);
      this.newUser = val && val.newUser ? !!val.newUser : false;
      this.organizationName = val && val.organizationName ? val.organizationName : null;
      this.organizationId = val && val.organizationId ? val.organizationId : null;
      if (this.organizationId) {
        this.registrantType = 'Organization';
      }
    });
  }

  get email(): string {
    return this.authenticationService.getEmail();
  }

  get lastName(): string {
    return this.authenticationService.getLastName();
  }

  get firstName(): string {
    return this.authenticationService.getFirstName();
  }

  onInfoSubmit(payload: InitialCreateInformation) {
    console.log('DEBUG create user profile ', payload);
    this.isRegistering = true;
    // WIP --save profile
    const profile = payload.userInput;
    this.userService.saveUser(profile).subscribe(
      (x) => {
        console.log('save user success ', x);
        this.isRegistering = false;
        this.router.navigate(['/prompt']);
      },
      (error) => {
        this.isRegistering = false;
        console.error('Save user error ', error);
        alert('Unable to save profile ' + error);
      }
    );
  }
}
