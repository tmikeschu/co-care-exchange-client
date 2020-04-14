import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss'],
})
export class SiteHeaderComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit() {}

  logout() {
    this.userService.logout();
  }
}
