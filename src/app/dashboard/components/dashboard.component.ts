import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { StatusDialogComponent } from './status-dialog/status-dialog.component';
// import { Status } from './models/dasboard';
import { DashboardService } from 'src/app/services/cce/dashboard.service';
import { Observable, Subscription } from 'rxjs';
import { SiteFooterComponent } from 'src/app/shared/site-footer/site-footer.component';
import { map } from 'rxjs/operators';
import { Agreement } from './models/agreement';
import { OrderCancelModel } from 'src/app/models/cce/order-model';

@Component({
  selector: 'app-cce-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // localrequests: Status[];
  subscriptionNeeds: Subscription;
  subscriptionShares: Subscription;
  dashboardService: DashboardService;
  footer: SiteFooterComponent;
  agreementNeeds: any[];
  agreementShares: any[];

  constructor(public dialog: MatDialog, dashboardService: DashboardService, footer: SiteFooterComponent) {
    this.dashboardService = dashboardService;
    this.subscriptionNeeds = this.dashboardService.agreementNeeds.subscribe();
    this.subscriptionShares = this.dashboardService.agreementShares.subscribe();
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

      if (confirm) {
        //TODO: this will need to call serivce and update the item...
      } else {
        //TODO: this will need to call serivce and update the item...

        const cancelOrder: OrderCancelModel = {
          orderId: agreement.agreementId,
          cancellingUserId: '22201103-DEC0-466F-B44F-1926BC1687C1',
          reason: 'No longer needed',
          clientMutationId: '123456'
        };

        this.dashboardService.postOrderCancelResponse(cancelOrder).subscribe((val) => {
          // TODO: figure out what to do here
          console.log(val);
        });
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscriptionNeeds.unsubscribe();
    this.subscriptionShares.unsubscribe();
  }
}


