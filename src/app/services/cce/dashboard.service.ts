import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result } from 'src/app/dashboard/components/models/dasboard';
import { environment } from 'src/environments/environment';
import { OrderStatusChangeModel } from 'src/app/models/cce/order-model';
import { UserService } from '../../core/services/user.service'
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

      // if (!result.data.dashboard.requested.length) {

      //   // TODO: remove once graphql API returns data
      //   result =
      //   {
      //     "data": {
      //       "dashboard": {
      //         "requested": [
      //           {
      //             "name": "Diapers",
      //             "statusId": 0,
      //             "statusText": "Looking for Supplier",
      //             "agreementId": "41d18d0501c14cc89e190667c45f3c57",
      //             "dialogMessage": "A supplier of your request has not yet been found.",
      //             "deliveryCoordinates": {
      //               "latitude": 39.7481,
      //               "longitude": -104.98742
      //             },
      //             "deliveryAddress": null
      //           },
      //           {
      //             "name": "Tampons",
      //             "statusId": 1,
      //             "statusText": "New Match!",
      //             "agreementId": "1d9e1eeffbac40db94e062ac00718e12",
      //             "dialogMessage": "A supplier has been found. Awaiting their confirmation.",
      //             "deliveryCoordinates": {
      //               "latitude": 39.7481,
      //               "longitude": -104.98742
      //             },
      //             "deliveryAddress": null
      //           },
      //           {
      //             "name": "Adult Meal(s)",
      //             "statusId": 2,
      //             "statusText": "Delivery Pending",
      //             "agreementId": "1d1e1eeffbac40db94e062ac00718e12",
      //             "dialogMessage": "Supplier has confirmed your request and sent it out for delivery. Have you received this item?",
      //             "deliveryCoordinates": {
      //               "latitude": 39.7481,
      //               "longitude": -104.98742
      //             },
      //             "deliveryAddress": null
      //           },
      //           {
      //             "name": "Child Meal(s)",
      //             "statusId": 3,
      //             "statusText": "Fulfilled",
      //             "agreementId": "1d1e1eeffbac40db94e062ac00718e02",
      //             "dialogMessage": "Your request has been delivered and is complete.",
      //             "deliveryCoordinates": {
      //               "latitude": 39.7481,
      //               "longitude": -104.98742
      //             },
      //             "deliveryAddress": null
      //           },
      //           {
      //             "name": "Something",
      //             "statusId": 4,
      //             "statusText": "Cancelled",
      //             "agreementId": "1d1e10effbac40db94e062ac00718e02",
      //             "dialogMessage": "Your request has been cancelled.",
      //             "deliveryCoordinates": {
      //               "latitude": 39.7481,
      //               "longitude": -104.98742
      //             },
      //             "deliveryAddress": null
      //           }
      //         ],
      //         "shared": [
      //           {
      //             "name": "Diapers",
      //             "statusId": 0,
      //             "statusText": "Looking for match",
      //             "agreementId": "41d18a0501c14cc89e190667c45f3c57",
      //             "dialogMessage": "No requests yet.",
      //             "deliveryCoordinates": {
      //               "latitude": 39.7481,
      //               "longitude": -104.98742
      //             },
      //             "deliveryAddress": "1999 N Broadway Denver CO"
      //           },
      //           {
      //             "name": "Tampons",
      //             "statusId": 1,
      //             "statusText": "New Match!",
      //             "agreementId": "0d9e1eeffbac40db94e062ac00718e12",
      //             "dialogMessage": "Someone is in need at the following address. Are you still able to supply and deliver them?",
      //             "deliveryCoordinates": {
      //               "latitude": 39.7481,
      //               "longitude": -104.98742
      //             },
      //             "deliveryAddress": "1999 N Broadway Denver CO"
      //           },
      //           {
      //             "name": "Adult Meal(s)",
      //             "statusId": 2,
      //             "statusText": "Delivery Pending",
      //             "agreementId": "1b1e1eeffbac40db94e062ac00718e12",
      //             "dialogMessage": "You have sent items out for delivery to this address.",
      //             "deliveryCoordinates": {
      //               "latitude": 39.7481,
      //               "longitude": -104.98742
      //             },
      //             "deliveryAddress": "1999 N Broadway Denver CO"
      //           },
      //           {
      //             "name": "Child Meal(s)",
      //             "statusId": 3,
      //             "statusText": "Fulfilled",
      //             "agreementId": "1d6e1eeffbac40db94e062ac00718e02",
      //             "dialogMessage": "Receiver has confirmed delivery.  This order is completed.",
      //             "deliveryCoordinates": {
      //               "latitude": 39.7481,
      //               "longitude": -104.98742
      //             },
      //             "deliveryAddress": "1999 N Broadway Denver CO"
      //           },
      //           {
      //             "name": "Something",
      //             "statusId": 4,
      //             "statusText": "Cancelled",
      //             "agreementId": "1d1e10effbac90db94e062ac00718e02",
      //             "dialogMessage": "This request has been cancelled.",
      //             "deliveryCoordinates": {
      //               "latitude": 39.7481,
      //               "longitude": -104.98742
      //             },
      //             "deliveryAddress": "1999 N Broadway Denver CO"
      //           }
      //         ]
      //       }
      //     }
      //   }
      // };

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
      'query': 'query View ($userId:ID!){ dashboard(userId:$userId) {requested{name, statusText, agreementId, dialogMessage, statusId, deliveryAddress, requestId, shareId}, shared{name, statusText, agreementId, dialogMessage, statusId, deliveryAddress, shareId, requestId}}}',
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
