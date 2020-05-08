import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, merge, fromEvent, timer, empty } from 'rxjs';
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
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private state = {
    needs: [],
    shares: [],
    loading: true
  };

  private _state = new BehaviorSubject<IDashboardState>(this.state);
  public readonly state$ = this._state.asObservable();

  private doPoll$ = new BehaviorSubject<boolean>(false);
  private isOnline$ = merge(of(null), fromEvent(window, 'online'), fromEvent(window, 'offline')).pipe(map(() => navigator.onLine));
  private userProfile$: Observable<UserProfile> = this.authService.auth$.pipe(
    filter(authState => authState.user && authState.user.userProfile)
    , map(authState => authState.user.userProfile)
  );

  constructor(
    private http: HttpClient,
    public userService: UserService,
    private authService: AuthenticationService,
    private apollo: Apollo
  ) {
    // query the dashboard every 5 seconds if the dashboard component is
    // alive and if the client has internet connectivity
    timer(0, 5000)
      .pipe(
        withLatestFrom(this.isOnline$, this.doPoll$, this.userProfile$),
        switchMap(([_tick, isOnline, doPoll, userProfile]) => {
          const empty$ = empty();
          empty$.subscribe({ complete: () => this.updateDashboard({ loading: false }) });
          return (isOnline && doPoll && userProfile) ? this.dashboardHandler(userProfile.id) : empty$;
        })
      )
      .subscribe(dashboardData => {
        const { requested, shared } = dashboardData;
        this.updateDashboard({ needs: requested, shares: shared });
      });
  }

  dashboardHandler(userProfileId: string) {
    return this.getDashboard(userProfileId)
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

  getDashboard(userId: string): Observable<Result> {
    const query = {
      query: `query View($userId: ID!) {
        dashboard(userId: $userId) {
            requested {
                itemId
                name
                orderId
                dialogMessage
                deliveryAddress
                addressLabel
                requestId
                sharerName
                shareId
                unitOfIssue
                quantity
                details
                statusDisplay
                status
            }, shared {
                itemId
                name
                orderId
                dialogMessage
                deliveryAddress
                addressLabel
                shareId
                unitOfIssue
                quantity
                requestId
                requesterName
                details
                statusDisplay
                status
            }
        }
    }`,
      variables: {
        userId: userId,
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
          input: updates
        }
      })
      .pipe(
        map(handleGQLErrors)
      );
  }

  private updateDashboard(updates: Partial<IDashboardState>) {
    this.state = Object.assign({}, this.state, updates);
    this._state.next(this.state);
  }
}
