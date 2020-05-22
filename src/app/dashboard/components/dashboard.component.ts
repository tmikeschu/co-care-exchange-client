import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { groupBy } from 'lodash';

import { DashboardService } from 'src/app/core/services/cce/dashboard.service';
import { Status } from 'src/app/core/constants/enums';
import { Agreement } from './models/agreement';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, takeUntil, tap, map } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface IDashboardGrouping {
  createdBy: string;
  items: Agreement[];
}
interface IDashboardViewModel {
  needs: IDashboardGrouping[];
  shares: IDashboardGrouping[];
  orgId?: string;
  filterState: string;
  loading: boolean;
}

@Component({
  selector: 'app-cce-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('rowAnimate', [
      state('rowClosed', style({
        transform: 'translateX(0)'
      })),
      state('rowOpen', style({
        transform: 'translateX(-75px)'
      })),
      transition('* => rowClosed', animate('0.25s')),
      transition('* => rowOpen', animate('0.25s')),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  vm$: Observable<IDashboardViewModel>;
  isAlive: boolean;
  rowState: 'rowOpen'|'rowClosed'|'';

  filter = new FormControl('');
  filter$: Observable<string>;

  destroy$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit() {
    this.dashboardService.startPolling();
    this.vm$ = this.dashboardService.state$.pipe(
      tap(dashboardState => {
        this.filter.patchValue(dashboardState.filterState);
      }),
      map(dashboardState => {
        return {
          ...dashboardState,
          shares: this.createGroupedEntries(dashboardState.shares),
          needs: this.createGroupedEntries(dashboardState.needs)
        };
      })
    );
    this.filter$ = this.filter.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );

    this.filter$.subscribe(filterValue => {
      this.dashboardService.changeFilterCriteria(filterValue);
    });
  }

  toggleRowState(rowState: 'rowOpen'|'rowClosed'|'') {
    this.rowState = rowState;
  }

  createGroupedEntries(agreements: Agreement[]) {
    const grouped: {[key: string]: Agreement[]} = groupBy(agreements, 'userDisplayName');
    return Object.entries(grouped).map(([name, items]) => {
      return {
        createdBy: name,
        items
      };
    });
  }

  formatItemDetails(agreement: Agreement) {
    return `${agreement.quantity}${agreement.unitOfIssue ? ', ' + agreement.unitOfIssue : ''}${agreement.details ? ', ' + agreement.details : ''}`
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

  onSwipeLeft($event) {
    console.log('event: ', $event);
  }

  ngOnDestroy() {
    this.dashboardService.stopPolling();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
