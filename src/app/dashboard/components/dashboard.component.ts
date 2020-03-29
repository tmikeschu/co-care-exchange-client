import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { StatusDialogComponent } from './status-dialog/status-dialog.component';
import { Status } from './models/dasboard';
import { DashboardService } from 'src/app/services/cce/dashboard.service';
import { Observable, Subscription } from 'rxjs';
import { SiteFooterComponent } from 'src/app/shared/site-footer/site-footer.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cce-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  localrequests: Status[];
  subscription: Subscription;
  dashboardservice: DashboardService;
  footer: SiteFooterComponent;
  
  constructor(public dialog: MatDialog, dashboardservice: DashboardService, footer: SiteFooterComponent) {     
    this.dashboardservice = dashboardservice;
    this.subscription = this.dashboardservice.agreements.subscribe();
  }

  ngOnInit() {
    window.scrollTo(0, 0);   
  }

  test(){      
    this.dashboardservice.getRequests2();
    // this.dashboardservice.testgraphQL().subscribe(data => {
    //   console.log('testgraphQL', data);
    // });
  }

  handleStatusClick(status: Status) {
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      width: '250px',
      data: status
    });

    dialogRef.afterClosed().subscribe(result => {
      //TODO: this will need to call serivce and update the item...
      console.log('The dialog was closed', result);      
      if(result){
        if(result.deny){
          // this.requests.find(x => x.requestId === result.requestId).deny = result.confirm;
          // this.requests.find(x => x.requestId === result.requestId).status = 'Cancelled';
          // this.requests.find(x => x.requestId === result.requestId).statusId = 3;
          // this.setlabelstyles();
        }

        if(result.confirm){
          // this.requests.find(x => x.requestId === result.requestId).confirm = result.confirm;
          // this.requests.find(x => x.requestId === result.requestId).status = 'Pickup Pending';
          // this.requests.find(x => x.requestId === result.requestId).statusId = 4;
          // this.setlabelstyles();
        }
      }

      //console.log('updated', this.requests);
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}


