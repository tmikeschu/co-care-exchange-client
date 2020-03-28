import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/cce/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
})
export class InformationComponent implements OnInit {
  registrantType: string;
  xx;
  error = false;

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.registrantType = 'Individual';
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
