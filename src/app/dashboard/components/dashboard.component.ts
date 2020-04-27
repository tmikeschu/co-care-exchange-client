import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { DashboardService, IDashboardState } from 'src/app/core/services/cce/dashboard.service';
import { Agreement } from './models/agreement';


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
    private dashboardService: DashboardService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.dashboardService.startPolling();
    this.vm$ = this.dashboardService.state$;
  }

  handleStatusClick(agreement: Agreement, type: String) {
    this.dashboardService.setSelectedAgreement(agreement);
    this.router.navigate(['/agreement-detail'], { queryParams: { type }});
  }

  getStyle(statusId): string {
    switch (statusId) {
      case -1: {
        // Error
        return 'contentstatusred';
      }
      case 0: {
        // Pending
        return 'contentstatusyellow';
      }
      case 1: {
        // Matched
        return 'contentstatusgreen';
      }
      case 2: {
        // Confirmed
        return 'contentstatusyellow';
      }
      case 3: {
        // Fulfilled
        return 'contentstatusgreen';
      }
      case 4: {
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
