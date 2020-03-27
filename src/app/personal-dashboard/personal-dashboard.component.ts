import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-dashboard',
  templateUrl: './personal-dashboard.component.html',
  styleUrls: ['./personal-dashboard.component.scss']
})
export class PersonalDashboardComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  edit() {
    this.router.navigate(['/info']);
  }
  add() {
    this.router.navigate(['/prompt']);
  }
  close() {
    this.router.navigate(['/dashboard']);
  }
  resource() {
    this.router.navigate(['/resources']);
  }

}
