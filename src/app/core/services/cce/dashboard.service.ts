import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result } from 'src/app/dashboard/components/models/dasboard';
import { environment } from 'src/environments/environment';
import { OrderStatusChangeModel } from 'src/app/models/cce/order-model';
import { UserService } from '../user.service'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  agreementNeeds: Subject<any> = new BehaviorSubject<any[]>([]);
  agreementShares: Subject<any> = new BehaviorSubject<any[]>([]);
  messageCount: number = 0;
  hasNeeds: boolean = false;
  hasShares: boolean = false;

  result: any;
  userProfile;

  constructor(
    private http: HttpClient,
    private router: Router,
    public userService: UserService
  ) {
    this.init();
  }

  async init() {      

    this.userProfile = this.userService.getCurrentUserProfile();
    if (!this.userProfile) this.router.navigate([ '/signIn' ]);

    this.getDashboard().subscribe(result => {
      console.log('dashboard results:', result);

      this.hasNeeds = result.data.dashboard.requested.length;
      this.hasShares = result.data.dashboard.shared.length

      if (this.hasNeeds) {
        result.data.dashboard.requested.map(need => need.statusTypeId = 1);
        result.data.dashboard.shared.map(share => share.statusTypeId = 2);
      }

      this.agreementNeeds.next(this.setlabelstyles(result.data.dashboard.requested));
      this.agreementShares.next(this.setlabelstyles(result.data.dashboard.shared));
    });
  }

  getDashboard(): Observable<Result> {
    const query = {
      'query': `query View($userId: ID!) {
        dashboard(userId: $userId) {
            requested {
                name,
                statusText,
                orderId,
                dialogMessage,
                statusId,
                deliveryAddress,
                requestId,
                shareId
            }, shared {
                name,
                statusText,
                orderId,
                dialogMessage,
                statusId,
                deliveryAddress,
                shareId,
                requestId
            }
        }
    }`,
      'variables': {
        "userId": this.userProfile && this.userProfile.id ? this.userProfile.id : '22201103dec0466fb44f1926bc1687c1' // TODO: just in case no items return for the demo
      }
    };
    return this.http.post<any>(`${environment.serverUrl}`, query);
  }

  updateOrderStatus(orderStatusChange: OrderStatusChangeModel): Observable<any> {

    console.log('orderToCancel: ', orderStatusChange);

    const input = {
      'operationName': 'OrderMutations',
      'query': `mutation OrderMutations($input: OrderStatusChangeInput!) {
        changeStatus(input: $input) {
            order {
                id,
                status,
                cancellationReason,
                requesterUserId
            }
        }
    }`,
      'variables': {
        input: orderStatusChange
      }
    };

    return this.http.post<any>(`${environment.serverUrl}`, input);
  }

  setlabelstyles(list) {
    console.log('setlabelstyles')

    this.messageCount += (list.filter(a => a.statusId === 2)).length;

    return list.map(a => {
      a.styleclass = this.getStyle(a.statusId);
      return a;
    });
  }

  getStyle(statusId): string {
    switch (statusId) {
      case -1:// Error
        {
          return 'contentstatusred';
        }
      case 0:// Pending
        {
          return 'contentstatusyellow';
        }
      case 1:// Matched
        {
          return 'contentstatusgreen';
        }
      case 2://Confirmed
        {
          return 'contentstatusyellow';
        }
      case 3://Fulfilled
        {
          return 'contentstatusgreen';
        }
      case 4://Cancelled
        {
          return 'contentstatusred';
        }
      default://there is no default, so error
        return 'contentstatusred';
    }
  }
}
