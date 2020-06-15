import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, tap, map } from 'rxjs/operators';
import { NearbyItemsService } from 'src/app/core/services/cce/nearby-items.service';
import { Agreement } from '../models/agreement';
import { UserProfile } from 'src/app/models/UserProfile';
import { UserService } from 'src/app/core/services/user.service';
import { DashboardGQL } from 'src/app/graphql/generatedSDK';

interface IRequestsViewModel {
  items: Agreement[];
  orgId?: string;
  filterState: string;
  loading: boolean;
}

@Component({
  selector: 'nearby-requests',
  templateUrl: './nearby-requests.component.html',
  styleUrls: ['./nearby-requests.component.scss']
})
export class NearbyRequestsComponent implements OnInit, OnDestroy {
  public requests: Observable<any[]>;
  public userProfile: UserProfile;
  isAlive: boolean;

  constructor(
    private itemsService: NearbyItemsService,
    private userService: UserService,
  private dashboardGQL: DashboardGQL) { }

  ngOnInit() {
    this.userProfile = this.userService.getCurrentUserProfile();

    this.requests = this.dashboardGQL
      .watch({
        userId: '9B4E922B-E194-4DB0-9D7F-72A08ED1BF44'
      })
      .valueChanges
      .pipe(map(result => {
        console.log(result);
        return result.data.dashboard.requested;
      }));
    
    
    //this.requests = this.itemsService.requests;
    //this.itemsService.loadRequests(this.userProfile.id);
  }

  formatItemDetails(agreement: Agreement) {
    return `${agreement.quantity}${agreement.unitOfIssue ? ', ' + agreement.unitOfIssue : ''}${agreement.details ? ', ' + agreement.details : ''}`
  }

  ngOnDestroy(): void {
    
  }
}
