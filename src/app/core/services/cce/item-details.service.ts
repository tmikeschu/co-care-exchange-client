import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap, filter, catchError, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

import { UserService } from '../user.service';
import { Agreement } from 'src/app/dashboard/components/models/agreement';
import { handleGQLErrors } from 'src/app/graphql/utils/error-handler';
import { ItemDetails } from 'src/app/graphql/queries/item-details.query';
import { AuthenticationService } from './authentication.service';
import { ICreateOrderNoteInput } from 'src/app/graphql/models/create-order-note-input';
import { CreateOrderNote, UpdateOrder } from 'src/app/graphql/mutations';
import { OrderChangeInput } from 'src/app/models/cce/order-model';

export interface IItemDetailState {
    itemDetails: Agreement;
    loading: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class ItemDetailsService {
    private state = {
        itemDetails: null
        , loading: true
    };

    private _state = new BehaviorSubject<IItemDetailState>(this.state);
    public readonly store$ = this._state.asObservable();

    private _itemId = new BehaviorSubject<string>(null);
    private readonly itemId$ = this._itemId.asObservable();

    private userProfileId$: Observable<string> = this.authService.auth$.pipe(
        filter(authState => authState.hasUserProfile),
        map(authState => authState.user.userProfile.id)
    );

    constructor(
        public userService: UserService,
        public authService: AuthenticationService,
        private apollo: Apollo
    ) {
        // TODO: error handling
        combineLatest([this.userProfileId$, this.itemId$])
            .pipe(
                switchMap(([userId, itemId]) => {
                    return this.apollo
                        .query({
                            query: ItemDetails
                            , variables: { userId, itemId }
                        }).pipe(map(handleGQLErrors));
                }),
                catchError((err: any) => {
                    console.error('an error occured querying item details: ', err);
                    return of({ itemDetails: null, loading: false });
                })
            )
            .subscribe(data => {
                this.updateState({ itemDetails: data.itemDetails, loading: false });
            });
    }

    private updateState(updates: Partial<IItemDetailState>) {
        this.state = Object.assign({}, this.state, updates);
        this._state.next(this.state);
    }

    /**
     * Public API
     */
    public getItem(id: string) {
        this._itemId.next(id);
    }

    public createOrderNote(note: Pick<ICreateOrderNoteInput, 'noteBody' | 'itemId'>): Observable<any> {
        // get the userprofileid, then issue the note create, then issue a side effect to reload the details view
        // catch error and handle subs in calling code
        return this.userProfileId$.pipe(
            map(userProfileId => {
                return {
                    ...note
                    , userId: userProfileId
                    , clientMutationId: '12345'
                };
            })
            , tap(payload => console.log('payload for createOrderNote: ', payload))
            , switchMap(payload => {
                return this.apollo
                    .mutate({
                        mutation: CreateOrderNote
                        , variables: {
                            input: payload
                        }
                    }).pipe(
                        map(handleGQLErrors)
                        , tap(() => {
                            /**
                             * Need to requery for item details due to that call returning
                             * different data based on whether it is a share, request, or order
                             */
                            this.getItem(note.itemId);
                        })
                    );
            })
        );
    }

    public updateOrder(order: Agreement, updates: Partial<OrderChangeInput>): Observable<any> {
        return this.userProfileId$.pipe(
            map(userProfileId => {
                const updateOrderPayload = {
                    orderId: order.orderId,
                    userId: userProfileId,
                    status: updates.status || null,
                    reason: updates.reason || 'Update status from agreement detail',
                    clientMutationId: '123456',
                };
                return updateOrderPayload;
            }),
            switchMap(payload => {
                return this.apollo
                    .mutate({
                        mutation: UpdateOrder
                        , variables: {
                            input: payload
                        }
                    })
                    .pipe(
                        map(handleGQLErrors)
                        , tap(data => {
                            if (data.updateOrder && data.updateOrder.orderViewModel) {
                                this.updateState({ itemDetails: data.updateOrder.orderViewModel });
                            }
                        })
                    );
            })
        );
    }
}
