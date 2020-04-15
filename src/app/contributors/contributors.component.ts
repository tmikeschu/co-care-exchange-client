import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.scss']
})
export class ContributorsComponent implements OnInit {

  constructor(
    private router: Router
  ) { }
  // constructor(public dialogRef: MatDialogRef<ContributorsComponent>) { }

  ngOnInit() {
  }

  backToResources() {
    this.router.navigate(['/resources']);
  }
}
