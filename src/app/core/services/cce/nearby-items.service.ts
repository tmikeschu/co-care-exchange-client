import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, merge, fromEvent, empty, zip, combineLatest } from 'rxjs';
import { map, switchMap, withLatestFrom, catchError, filter } from 'rxjs/operators';

import { NearbyRequestsResult } from 'src/app/dashboard/components/models/nearby-requests-result';
import { Agreement } from 'src/app/dashboard/components/models/agreement';
import { environment } from 'src/environments/environment';
import { INearbyItemsListState } from 'src/app/dashboard/components/models/nearby-items-list-state';
import { UserProfile } from 'src/app/models/UserProfile';
import { UserService } from '../user.service';
import { AuthenticationService } from './authentication.service';
import { DashboardGQL } from 'src/app/graphql/generatedSDK';

@Injectable({
  providedIn: 'root'
})
export class NearbyItemsService {
  private isOnline$ = merge(of(null), fromEvent(window, 'online'), fromEvent(window, 'offline')).pipe(map(() => navigator.onLine));
  private _requests: BehaviorSubject<Agreement[]> = new BehaviorSubject([]);
  private _dataStore: { requests: Agreement[] } = { requests: [] };

  public readonly requests: Observable<Agreement[]> = this._requests.asObservable();

  constructor(
    private http: HttpClient,
    public userService: UserService,
    private authService: AuthenticationService,
    private dashboardQuery: DashboardGQL) {
      this.authService.auth$.pipe(
        filter((authState) => authState.user && authState.user.userProfile),
        map((authState) => authState.user.userProfile)
      );
   }

  loadRequests(userId: string) {
    // TODO: Test only!
    userId = '02804AA3-5C9E-4D18-A6D2-24F05235830B';

    this.getNearbyRequests(userId)
      .subscribe(result => {
        console.log(`${result.data.nearbyRequests.requested.length} nearby requests discovered`);

        //this._dataStore.requests = result.data.requests;
        this._requests.next(Object.assign({}, result.data.nearbyRequests.requested));
      }, error => {
        console.error('An error occurred querying nearby requests: ', error.message);
        return of(this._dataStore.requests);
      })
  }

  private getNearbyRequests(userId: string): Observable<NearbyRequestsResult> {
    const query = {
      query: `query View($userId: ID!) {
        nearbyRequests(userId: $userId) {
          requested {
            itemId,
            userDisplayName,
            name,
            quantity,
            unitOfIssue,
            details,
            status,
            statusDisplay
          }
        }
    }`,
      variables: {
        userId: userId
      },
    };

    return this.http.post<any>(`${environment.serverUrl}`, query);
  }
}