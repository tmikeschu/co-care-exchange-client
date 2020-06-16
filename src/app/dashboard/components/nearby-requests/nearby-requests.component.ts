import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, startWith, filter } from 'rxjs/operators';
import { Agreement } from '../models/agreement';
import { NearbyRequestsGQL } from 'src/app/graphql/generatedSDK';
import { AuthenticationService } from 'src/app/core/services/cce/authentication.service';

@Component({
  selector: 'app-nearby-requests',
  templateUrl: './nearby-requests.component.html',
  styleUrls: ['./nearby-requests.component.scss', '../dashboard.component.scss', '../nearby-items/nearby-items.component.scss']
})
export class NearbyRequestsComponent implements OnInit {
  vm$: Observable<{ state: string, requests: Array<Agreement> }>;
  user$: Observable<any>;

  constructor(
    private authSvc: AuthenticationService,
    private nearbyRequestsQuery: NearbyRequestsGQL) {
    this.user$ = this.authSvc.auth$.pipe(
      filter((authState) => authState.user && authState.user.userProfile),
      map((authState) => authState.user.userProfile)
    );
  }

  ngOnInit() {
    this.vm$ = this.user$.pipe(
      switchMap((user: any) => this.getNearbyRequests(user.id)),
      startWith({ state: 'loading', requests: [] })
    );
  }

  getNearbyRequests(userId: string) {
    return this.nearbyRequestsQuery.watch({ userId })
      .valueChanges
      .pipe(
        map((results: any) => {
          return {
            state: 'done',
            requests: results.data && results.data.nearbyRequests && results.data.nearbyRequests.requested.length ?
              results.data.nearbyRequests.requested :
              []
          };
        })
      );
  }
}
