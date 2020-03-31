import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { StatusDialogComponent } from './status-dialog/status-dialog.component';
// import { Status } from './models/dasboard';
import { DashboardService } from 'src/app/services/cce/dashboard.service';
import { Observable, Subscription } from 'rxjs';
import { SiteFooterComponent } from 'src/app/shared/site-footer/site-footer.component';
import { map } from 'rxjs/operators';
import { Agreement } from './models/agreement';

@Component({
  selector: 'app-cce-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // localrequests: Status[];
  subscriptionNeeds: Subscription;
  subscriptionShares: Subscription;
  dashboardservice: DashboardService;
  footer: SiteFooterComponent;
  agreementNeeds: any[];
  agreementShares: any[];
  
  constructor(public dialog: MatDialog, dashboardservice: DashboardService, footer: SiteFooterComponent) {     
    this.dashboardservice = dashboardservice;
    this.subscriptionNeeds = this.dashboardservice.agreementNeeds.subscribe();
    this.subscriptionShares = this.dashboardservice.agreementShares.subscribe();
  }

  ngOnInit() {
    window.scrollTo(0, 0); 
  }

  handleStatusClick(agreement: Agreement) {
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      width: '300px',
      data: agreement
    });

    dialogRef.afterClosed().subscribe(confirm => { 
      //TODO: Check to see if this is a request or a supply result...

      if(confirm){
        //TODO: this will need to call serivce and update the item...
      }else{
        //TODO: this will need to call serivce and update the item...
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscriptionNeeds.unsubscribe();
    this.subscriptionShares.unsubscribe();
  }
}


