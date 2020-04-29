import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { DashboardService, IDashboardState } from 'src/app/core/services/cce/dashboard.service';
import { Status } from 'src/app/core/constants/enums';


@Component({
  selector: 'app-cce-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  vm$: Observable<IDashboardState>;
  isAlive: boolean;

  constructor(
    public dialog: MatDialog,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.dashboardService.startPolling();
    this.vm$ = this.dashboardService.state$;
  }

  getStyle(status: Status): string {
    switch (status) {
      case Status.FindingMatch: {
        // Pending
        return 'contentstatusyellow';
      }
      case Status.NewMatchFound: {
        // Matched
        return 'contentstatusgreen';
      }
      case Status.DeliveryPending: {
        // Confirmed
        return 'contentstatusyellow';
      }
      case Status.OrderFulfilled: {
        // Fulfilled
        return 'contentstatusgreen';
      }
      case Status.OrderCancelled: {
        // Cancelled
        return 'contentstatusred';
      }
      default:
        // there is no default, so error
        return 'contentstatusred';
    }
  }

  ngOnDestroy() {
    this.dashboardService.stopPolling();
  }
}
