import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DashboardService } from 'src/app/core/services/cce/dashboard.service';
import { Observable, timer, of } from 'rxjs';
import { catchError, filter, map, share, switchMap, takeWhile } from 'rxjs/operators';
import { Agreement } from './models/agreement';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-cce-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardPoll$: Observable<any>;
  dashboardData$: Observable<any>;
  needs$: Observable<any>;
  shares$: Observable<any>;
  isAlive: boolean;

  constructor(
    public dialog: MatDialog,
    private dashboardService: DashboardService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.data.pipe(filter((data) => data.user)).subscribe((data) => {
      console.log('DEBUG route data :', data);
      this.pollForData();
    });
    this.isAlive = true;
  }

  private pollForData(): void {
    const userProfile = this.userService.getCurrentUserProfile();
    if (!userProfile) {
      return;
    }
    this.dashboardPoll$ = timer(0, 5000).pipe(
      takeWhile(() => this.isAlive),
      switchMap(() => {
        return this.dashboardService.getDashboard(userProfile.id).pipe(
          map((data: any) => {
            if (data && data.errors) {
              const messages = data.errors.map((e) => e.message).join(', ');
              throw new Error(messages);
            }
            return data.data.dashboard;
          }),
          catchError((error) => {
            console.warn('an error occurred querying the dashboard', error.message);
            return of({ data: { dashboard: { requested: [], shared: [] } } });
          })
        );
      }),
      share()
    );
    this.needs$ = this.dashboardPoll$.pipe(map((dashboard) => dashboard.requested));
    this.shares$ = this.dashboardPoll$.pipe(map((dashboard) => dashboard.shared));
    this.needs$.subscribe((needs) => {
      console.log('DASHBOARD NEEDS: ', needs);
    });
    this.shares$.subscribe((shares) => {
      console.log('DASHBOARD SHARES: ', shares);
    });
  }

  handleStatusClick(agreement: Agreement, type: String) {
    this.dashboardService.agreementDetail = agreement;
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
    this.isAlive = false;
  }
}
