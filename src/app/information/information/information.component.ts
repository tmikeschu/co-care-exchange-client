import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/cce/authentication.service';
import {UserService} from '../../core/services/user.service';
import {OrganizationService} from '../../core/services/organization.service';

@Component({
  selector: 'app-register',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
})
export class InformationComponent implements OnInit {
  registrantType: string;
  xx;
  error = false;

  // TODO -- combine the authservice user stuff with user service
  constructor(private authenticationService: AuthenticationService, private orgService: OrganizationService) {}

  ngOnInit() {
    this.registrantType = 'Individual';
    this.orgService.getOrganizations().subscribe(orgs => console.log(orgs));
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
}
