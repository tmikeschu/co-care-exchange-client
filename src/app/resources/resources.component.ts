import { Component, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material';
// import { ContributorsComponent } from '../contributors/contributors.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  constructor(
    private router: Router,
    // private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openNewTab(url: string) {
    window.open(url, '_blank');
  }

  showCredits() {
    this.router.navigate(['/contributors']);
    // this.dialog.open(ContributorsComponent, {
    //   width: '300px',
    //   // height: '50%',
    //   height: '500px'
    // });

  }

}
