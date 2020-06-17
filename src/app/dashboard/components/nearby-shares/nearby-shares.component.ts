import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, startWith, filter } from 'rxjs/operators';

import { NearbySharesGQL, DashboardItem } from 'src/app/graphql/generatedSDK';
import { AuthenticationService } from 'src/app/core/services/cce/authentication.service';
import { UIState } from 'src/app/core/constants/enums';

@Component({
  selector: 'app-nearby-shares',
  templateUrl: './nearby-shares.component.html',
  styleUrls: ['./nearby-shares.component.scss', '../dashboard.component.scss', '../nearby-items/nearby-items.component.scss']
})
export class NearbySharesComponent implements OnInit {
  vm$: Observable<{ state: UIState, shares?: Array<DashboardItem> }>;
  user$ = this.authSvc.auth$.pipe(
    filter((authState) => authState.user && authState.user.userProfile),
    map((authState) => authState.user.userProfile)
  );

  constructor(
    private authSvc: AuthenticationService,
    private nearbySharesQuery: NearbySharesGQL) { }

  ngOnInit() {
    this.vm$ = this.user$.pipe(
      switchMap((user: any) => this.getNearbyShares(user.id)),
      startWith({ state: UIState.Loading, shares: [] }),
    );
  }

  getNearbyShares(userId: string): Observable<{ state: UIState, shares: Array<DashboardItem> }> {
    return this.nearbySharesQuery.watch({ userId })
      .valueChanges
      .pipe(
        map((results: any) => {
          return {
            state: UIState.Done,
            shares: results.data && results.data.nearbyShares && results.data.nearbyShares.shared.length ?
              results.data.nearbyShares.shared :
              []
          };
        })
      );
  }
}
