import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import { Agreement } from '../models/agreement';
import { UserProfile } from 'src/app/models/UserProfile';
import { UserService } from 'src/app/core/services/user.service';
import { NearbyRequestsGQL } from 'src/app/graphql/generatedSDK';

@Component({
  selector: 'app-nearby-requests',
  templateUrl: './nearby-requests.component.html',
  styleUrls: ['./nearby-requests.component.scss']
})
export class NearbyRequestsComponent implements OnInit {
  vm$: Observable<{ state: 'loading' | 'done', requests: Array<Agreement> }>;
  initialState = {
    state: 'loading',
    requests: []
  };

  constructor(
    private userService: UserService,
    private nearbyRequestsQuery: NearbyRequestsGQL) { }

  ngOnInit() {
    this.vm$ = this.userService.getCurrentUser$().pipe(
      map((user: any) => user.userProfile.id),
      switchMap((userId: string) => this.getNearbyRequests(userId)),
      startWith(this.initialState)
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

  formatItemDetails(agreement: Agreement) {
    return `${agreement.quantity}${agreement.unitOfIssue ? ', ' + agreement.unitOfIssue : ''}${agreement.details ? ', ' + agreement.details : ''}`
  }
}
