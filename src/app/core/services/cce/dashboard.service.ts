import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, merge, fromEvent, timer, empty } from 'rxjs';
import { map, switchMap, withLatestFrom, share, catchError, filter } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { Result } from 'src/app/dashboard/components/models/dasboard';
import { environment } from 'src/environments/environment';
import { OrderChangeInput } from 'src/app/models/cce/order-model';
import { UserService } from '../user.service';
import { Agreement } from 'src/app/dashboard/components/models/agreement';
import { UserProfile } from 'src/app/models/UserProfile';

export interface IDashboardState {
  needs: Agreement[];
  shares: Agreement[];
  activeAgreement?: Agreement;
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private state = {
    needs: [],
    shares: [],
    activeAgreement: null,
    loading: true
  };

  private _state = new BehaviorSubject<IDashboardState>(this.state);
  public readonly state$ = this._state.asObservable();

  doPoll$ = new BehaviorSubject<boolean>(false);
  isOnline$ = merge(of(null), fromEvent(window, 'online'), fromEvent(window, 'offline')).pipe(map(() => navigator.onLine));
  userProfile$: Observable<UserProfile> = this.userService.getCurrentUserAsObs$().pipe(
    filter(u => u !== undefined), map((user: any) => user.userProfile));

  constructor(
    private http: HttpClient,
    public userService: UserService,
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
        }),
        share()
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
        }),
        share()
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
                name
                statusText
                orderId
                dialogMessage
                statusId
                deliveryAddress
                addressLabel
                requestId
                sharerName
                shareId
                unitOfIssue
                quantity
                details
                description
            }, shared {
                name
                statusText
                orderId
                dialogMessage
                statusId
                deliveryAddress
                addressLabel
                shareId
                unitOfIssue
                quantity
                requestId
                requesterName
                details
                description
            }
        }
    }`,
      variables: {
        userId: userId,
      },
    };
    return this.http.post<any>(`${environment.serverUrl}`, query);
  }

  updateOrderStatus(orderStatusChange: OrderChangeInput): Observable<any> {
    const input = {
      operationName: 'OrderMutations',
      query: `mutation OrderMutations($input: OrderChangeInput!) {
        changeStatus(input: $input) {
            order {
                id,
                status,
                cancellationReason,
                requestingUserId
            },
            orderViewModel {
              name,
              statusText,
              orderId,
              dialogMessage,
              statusId,
              deliveryAddress,
              addressLabel,
              shareId,
              unitOfIssue,
              quantity
              requestId,
              details,
              description
            }
        }
    }`,
      variables: {
        input: orderStatusChange,
      },
    };
    console.log('updateOrderStatus mutation: ', input);
    return this.http.post<any>(`${environment.serverUrl}`, input);
  }

  updateOrderDescription(order) {
    const UpdateOrderDescription = gql`
      mutation UpdateOrderDescription($input: OrderChangeInput!) {
        updateOrderDescription(input: $input) {
          clientMutationId,
          order {
            id,
            status,
            description
          },
          orderViewModel {
            name,
            statusText,
            orderId,
            dialogMessage,
            statusId,
            deliveryAddress,
            addressLabel,
            shareId,
            unitOfIssue,
            quantity
            requestId,
            details,
            description
          }
        }
      }
    `;
    console.log('updateOrderDescription mutation: ', UpdateOrderDescription);
    console.log('updateOrderDescription order: ', order);
    return this.apollo
      .mutate({
        mutation: UpdateOrderDescription,
        variables: {
          input: order,
        }
      });
  }

  setSelectedAgreement(agreement: Agreement) {
    this.updateDashboard({ activeAgreement: agreement });
  }

  private updateDashboard(updates: Partial<IDashboardState>) {
    this.state = Object.assign({}, this.state, updates);
    this._state.next(this.state);
  }
}
