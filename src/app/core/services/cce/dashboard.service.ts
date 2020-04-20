import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import gql from 'graphql-tag';
import { Result } from 'src/app/dashboard/components/models/dasboard';
import { environment } from 'src/environments/environment';
import { OrderChangeInput } from 'src/app/models/cce/order-model';
import { UserService } from '../user.service';
import { Apollo } from 'apollo-angular';
import { Agreement } from 'src/app/dashboard/components/models/agreement';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  agreementNeeds: Subject<any> = new BehaviorSubject<any[]>([]);
  agreementShares: Subject<any> = new BehaviorSubject<any[]>([]);
  // agreementDetail: Agreement;
  selectedAgreementSubject$ = new BehaviorSubject<any>(null);
  readonly agreement$ = this.selectedAgreementSubject$.asObservable();
  messageCount = 0;
  hasNeeds = false;
  hasShares = false;

  result: any;
  userProfile;

  constructor(private http: HttpClient, public userService: UserService, private apollo: Apollo) {
    
  }

  init() {
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
                addressLabel,
                requestId,
                shareId,                
                unitOfIssue,
                quantity,                
                details,
                description
            }, shared {
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

  updateMessageCount(list) {
    this.messageCount += list.filter((a) => a.statusId === 2).length;
    return list;
  }

  get selectedAgreement() {
    return this.agreement$;
  }

  setSelectedAgreement(agreement) {
    this.selectedAgreementSubject$.next(agreement);
  }
}
