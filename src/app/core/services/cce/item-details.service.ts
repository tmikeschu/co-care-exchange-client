import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, combineLatest, Subject } from 'rxjs';
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
    userId: string;
    loading: boolean;
    newMessagePending: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class ItemDetailsService {
    private state = {
        itemDetails: null
        , userId: null
        , loading: true
        , newMessagePending: false
    };

    private _state = new BehaviorSubject<IItemDetailState>(this.state);
    public readonly store$ = this._state.asObservable();

    private _itemId = new Subject<string>();
    private readonly itemId$ = this._itemId.asObservable();

    private showLoader$ = new BehaviorSubject(true);

    private userProfileId$: Observable<string> = this.authService.auth$.pipe(
        filter(authState => authState.hasUserProfile)
        , map(authState => authState.user.userProfile.id)
        , tap(id => this.updateState({ userId: id }))
    );

    constructor(
        public userService: UserService,
        public authService: AuthenticationService,
        private apollo: Apollo
    ) {
        combineLatest([this.userProfileId$, this.itemId$, this.showLoader$])
            .pipe(
                tap(([profileId, _itemId, showLoader]) => {
                    /**
                     * should improve this but need to conditionally show loading
                     * indicator. Use case: we added polling into the detail component.
                     * this will allow us to query for fresh itemDetails without breaking the UI
                     * with a loader
                     */
                    if (showLoader) {
                        this.updateState({ itemDetails: null, loading: true });
                    }
                })
                , switchMap(([userId, itemId]) => {
                    return this.apollo
                        .query({
                            query: ItemDetails
                            , variables: { userId, itemId }
                        }).pipe(map(handleGQLErrors));
                })
                , catchError((err: any) => {
                    console.error('an error occured querying item details: ', err);
                    return of({ itemDetails: null, loading: false });
                })
            )
            .subscribe(data => {
                this.updateState({ itemDetails: data.itemDetails, loading: false, newMessagePending: false });
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

    public refreshItemDetail(itemId: string) {
        this.showLoader$.next(false);
        this.updateState({ newMessagePending: true });
        this.getItem(itemId);
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
                            this.refreshItemDetail(note.itemId);
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
