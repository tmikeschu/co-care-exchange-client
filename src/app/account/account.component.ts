import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0)
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
