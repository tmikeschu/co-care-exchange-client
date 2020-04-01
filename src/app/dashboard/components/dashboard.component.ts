import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, fadeInItems } from '@angular/material';
import { StatusDialogComponent } from './status-dialog/status-dialog.component';
// import { Status } from './models/dasboard';
import { DashboardService } from 'src/app/services/cce/dashboard.service';
import { Observable, Subscription } from 'rxjs';
import { SiteFooterComponent } from 'src/app/shared/site-footer/site-footer.component';
import { map } from 'rxjs/operators';
import { Agreement } from './models/agreement';
import { OrderStatusChangeModel } from 'src/app/models/cce/order-model';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    public dialog: MatDialog,
    dashboardService: DashboardService,
    footer: SiteFooterComponent,
    private toastrService: ToastrService) {
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

      if (confirm) {

        if (agreement.statusId >= 3) return; // fulfilled or cancelled already; noop

        try {
          const orderChangeStatus: OrderStatusChangeModel = {
            id: agreement.agreementId,
            requesterUserId: this.dashboardService.userProfile.id,
            status: agreement.statusId++,
            cancellationReason: 'unknown',
            clientMutationId: '123456'
          };

          let status = this.dashboardService.updateOrderStatus(orderChangeStatus).subscribe((val) => {
            console.log(val);
            if (val && val.errors && val.errors.length) {
              val.errors.forEach(e => {
                console.log('ORDER UPDATE ERROR', e.message);
                throw new Error(e.message);
              });
            } else {
              this.dashboardService.init();
            }
          });

          console.log('status', status);

        } catch (error) {
          this.toastrService.error(`Error: order status update request for ${agreement.name} failed.`, null, {
            enableHtml: true,
            disableTimeOut: true
          });
        }

      } else {

        try {
          const orderToCancel: OrderStatusChangeModel = {
            id: agreement.agreementId,
            requesterUserId: this.dashboardService.userService.currentUserProfile.id,
            status: 4, // cancel
            cancellationReason: 'No longer needed',
            clientMutationId: '123456'
          };

          let status = this.dashboardService.cancelOrder(orderToCancel).subscribe((val) => {
            console.log(val);
            if (val && val.errors && val.errors.length) {
              val.errors.forEach(e => {
                console.log('ORDER CANCEL ERROR', e.message);
                this.toastrService.error(`Error: order cancel request for ${agreement.name} failed.`, null, {
                  enableHtml: true,
                  disableTimeOut: true
                });
              });
            } else {
              this.dashboardService.init();
            }
          });
          console.log('status', status);
        } catch (error) {
          this.toastrService.error(`Error: order cancel request for ${agreement.name} failed.`, null, {
            enableHtml: true,
            disableTimeOut: true
          });
        }

      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscriptionNeeds.unsubscribe();
    this.subscriptionShares.unsubscribe();
  }
}
