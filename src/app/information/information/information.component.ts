import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/cce/authentication.service';
import { UserService } from '../../core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileInformation } from '../models/info-create.model';
import { OrganizationService } from '../../core/services/organization.service'

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
  profile = null;
  userOrganization = null;

  isRegistering = false;

  // TODO -- combine the authservice user stuff with user service
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private organizationService: OrganizationService,
    private toastrService: ToastrService
  ) { }


  async ngOnInit() {
    this.registrantType = 'Individual';
    // this.orgService.getOrganizations$().subscribe((orgs) => console.log(orgs));
    this.profile = await this.userService.getUser(this.email).pipe(first()).toPromise();
    // TODO: need to swap this out for live org id
    this.userOrganization = await this.organizationService.getUserOrganization('707FB6A6-3067-4FC7-AED0-DEE58A276269').pipe(first()).toPromise();


    this.route.queryParams.subscribe((val) => {
      console.log('DEBUG info newuser, org ', val);
      if (this.profile && this.userOrganization) {
        this.newUser = false;
        // TODO: remove this fallback
        this.organizationName = this.userOrganization && this.userOrganization.name ? this.userOrganization.name : 'Metro Caring';
        this.organizationId = this.userOrganization && this.userOrganization.id ? this.userOrganization.id : '707FB6A6-3067-4FC7-AED0-DEE58A276269';
      } else {
        this.newUser = true;
        // TODO: remove this fallback
        this.organizationName = val && val.organizationName ? val.organizationName : 'Metro Caring';
        this.organizationId = val && val.organizationId ? val.organizationId : "707FB6A6-3067-4FC7-AED0-DEE58A276269"; // TODO: replace w/ null
      }
      
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

  onInfoSubmit(payload: UserProfileInformation) {
    console.log('DEBUG create user profile ', payload);
    this.isRegistering = true;
    // WIP --save profile
    const profile = payload.userInput;
    console.log('DEBUG profile to save ', profile);
    this.userService.saveUser(profile).subscribe(
      (x) => {
        console.log('save user success ', x);
        this.isRegistering = false;
        this.router.navigate(['/prompt']);
      },
      (error) => {
        this.isRegistering = false;
        console.error('Save user error ', error);
        this.toastrService.error('Unable to save profile. Please try again later');
      }
    );
  }
}
