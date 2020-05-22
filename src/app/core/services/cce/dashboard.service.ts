import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, merge, fromEvent, timer, empty, zip, combineLatest } from 'rxjs';
import { map, switchMap, withLatestFrom, catchError, filter } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

import { Result } from 'src/app/dashboard/components/models/dasboard';
import { environment } from 'src/environments/environment';
import { OrderChangeInput } from 'src/app/models/cce/order-model';
import { UserService } from '../user.service';
import { Agreement } from 'src/app/dashboard/components/models/agreement';
import { UserProfile } from 'src/app/models/UserProfile';
import { UpdateOrder } from 'src/app/graphql/mutations/update-order.mutation';
import { handleGQLErrors } from 'src/app/graphql/utils/error-handler';
import { AuthenticationService } from './authentication.service';

export interface IDashboardState {
  needs: Agreement[];
  shares: Agreement[];
  orgId?: string;
  filterState: string;
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private state: IDashboardState = {
    needs: [],
    shares: [],
    loading: true,
    filterState: 'myItems'
  };

  private _state = new BehaviorSubject<IDashboardState>(this.state);
  public readonly state$ = this._state.asObservable();

  private doPoll$ = new BehaviorSubject<boolean>(false);
  private isOnline$ = merge(of(null), fromEvent(window, 'online'), fromEvent(window, 'offline')).pipe(map(() => navigator.onLine));
  private userProfile$: Observable<UserProfile> = this.authService.auth$.pipe(
    filter((authState) => authState.user && authState.user.userProfile),
    map((authState) => authState.user.userProfile)
  );

  private orgId$: Observable<string> = this.userProfile$
    .pipe(
      filter(userProfile => {
        return !!userProfile && !!userProfile.organization && !!userProfile.organization.id;
      }),
      map(userProfile => {
        return userProfile.organization.id;
      }),
    );

  private filter$ = new BehaviorSubject<string>(this.state.filterState);

  private dashboardInputs$ = combineLatest([
    this.doPoll$,
    this.isOnline$,
    this.userProfile$,
    this.filter$
  ]);

  constructor(
    private http: HttpClient,
    public userService: UserService,
    private authService: AuthenticationService,
    private apollo: Apollo
  ) {
    // query the dashboard every 5 seconds if the dashboard component is
    // alive and if the client has internet connectivity
    timer(0, 1000000)
      .pipe(
        withLatestFrom(this.dashboardInputs$),
        switchMap(([_tick, [doPoll, isOnline, userProfile, filterCriteria]]) => {
          const empty$ = empty();
          empty$.subscribe({ complete: () => this.updateDashboard({ loading: false }) });
          return (isOnline && doPoll && userProfile) ? this.dashboardHandler(userProfile.id, filterCriteria) : empty$;
        })
      )
      .subscribe((dashboardData) => {
        const { requested, shared } = dashboardData;
        this.updateDashboard({ needs: requested, shares: shared });
      });

    this.orgId$.subscribe(orgId => this.updateDashboard({ orgId }));
  }

  dashboardHandler(userProfileId: string, filterCriteria: string) {
    const formattedFilter = filterCriteria === 'showAllOrganization' ? filterCriteria : null;
    return this.getDashboard(userProfileId, formattedFilter)
      .pipe(
        map((data: any) => {
          if (data && data.errors) {
            const messages = data.errors.map((e) => e.message).join(', ');
            throw new Error(messages);
          }
          return data.data.dashboard;
        }),
        catchError((error: any) => {
          console.error('an error occurred querying the dashboard: ', error.message);
          return of(this._state); // serve a cached version on error
        })
      );
  }

  startPolling() {
    this.doPoll$.next(true);
  }

  stopPolling() {
    this.doPoll$.next(false);
  }

  changeFilterCriteria(criteria: string) {
    this.updateDashboard({ filterState: criteria, loading: true });
    this.filter$.next(criteria);
  }

  getDashboard(userId: string, filterOption: string): Observable<Result> {
    const query = {
      query: `query View($userId: ID!, $filterOption: String) {
        dashboard(userId: $userId, filterOption: $filterOption) {
            requested {
                itemId
                name
                unitOfIssue
                quantity
                details
                statusDisplay
                status
                userDisplayName
            }, shared {
                itemId
                name
                unitOfIssue
                quantity
                details
                statusDisplay
                status
                userDisplayName
            }
        }
    }`,
      variables: {
        userId: userId,
        filterOption
      },
    };
    return this.http.post<any>(`${environment.serverUrl}`, query);
  }

  updateOrder(updates: Partial<OrderChangeInput>): Observable<any> {
    console.log('[DEBUG] updateOrder input: ', updates);
    return this.apollo
      .mutate({
        mutation: UpdateOrder,
        variables: {
          input: updates,
        },
      })
      .pipe(map(handleGQLErrors));
  }

  private updateDashboard(updates: Partial<IDashboardState>) {
    this.state = Object.assign({}, this.state, updates);
    this._state.next(this.state);
  }
}
