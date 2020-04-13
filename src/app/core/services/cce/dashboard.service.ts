import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result } from 'src/app/dashboard/components/models/dasboard';
import { environment } from 'src/environments/environment';
import { OrderStatusChangeModel } from 'src/app/models/cce/order-model';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  agreementNeeds: Subject<any> = new BehaviorSubject<any[]>([]);
  agreementShares: Subject<any> = new BehaviorSubject<any[]>([]);
  messageCount = 0;
  hasNeeds = false;
  hasShares = false;

  result: any;
  userProfile;

  constructor(private http: HttpClient, public userService: UserService) {
    // TODO -- figure out when to invoke service this.init();
  }

  init() {
    // DEV QUESTION: what is the purpose of this vs the call from the component?
    // try {
    //   this.getDashboard().subscribe((result) => {
    //     console.log('dashboard results:', result);
    //
    //     this.hasNeeds = result.data.dashboard.requested.length;
    //     this.hasShares = result.data.dashboard.shared.length;
    //
    //     if (this.hasNeeds) {
    //       result.data.dashboard.requested.map((need) => (need.statusTypeId = 1));
    //       result.data.dashboard.shared.map((share) => (share.statusTypeId = 2));
    //     }
    //
    //     this.agreementNeeds.next(this.updateMessageCount(result.data.dashboard.requested));
    //     this.agreementShares.next(this.updateMessageCount(result.data.dashboard.shared));
    //   });
    // } catch (e) {
    //   console.error('Dashboard data error ', e);
    //   this.router.navigate(['/']);
    // }
  }

  getDashboard(userId: string): Observable<Result> {
    const query = {
      query: `query View($userId: ID!) {
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
      variables: {
        userId: userId,
      },
    };
    return this.http.post<any>(`${environment.serverUrl}`, query);
  }

  updateOrderStatus(orderStatusChange: OrderStatusChangeModel): Observable<any> {
    console.log('orderToCancel: ', orderStatusChange);

    const input = {
      operationName: 'OrderMutations',
      query: `mutation OrderMutations($input: OrderStatusChangeInput!) {
        changeStatus(input: $input) {
            order {
                id,
                status,
                cancellationReason,
                requesterUserId
            }
        }
    }`,
      variables: {
        input: orderStatusChange,
      },
    };

    return this.http.post<any>(`${environment.serverUrl}`, input);
  }

  updateMessageCount(list) {
    this.messageCount += list.filter((a) => a.statusId === 2).length;
    return list;
  }
}
