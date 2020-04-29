import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, combineLatest } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

import { UserService } from '../user.service';
import { Agreement } from 'src/app/dashboard/components/models/agreement';
import { handleGQLErrors } from 'src/app/graphql/utils/error-handler';
import { ItemDetails } from 'src/app/graphql/queries/item-details.query';

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

    private userProfileId$: Observable<string> = this.userService.getCurrentUser$()
        .pipe(filter(u => u !== undefined), map((user: any) => user.userProfile.id));

    constructor(
        public userService: UserService,
        private apollo: Apollo
    ) {
        // TODO: error handling
        combineLatest([this.userProfileId$, this.itemId$])
            .pipe(
                switchMap(([userId, itemId]) => {
                    return this.apollo
                        .query({
                            query: ItemDetails,
                            variables: { userId, itemId }
                        }).pipe(map(handleGQLErrors));
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

    public getItem(id: string) {
        this._itemId.next(id);
    }
}
