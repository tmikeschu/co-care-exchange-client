import { Component, OnInit } from '@angular/core';
import { ItemDetailsGQL, DashboardItemDetails } from 'src/app/graphql/generatedSDK';
import { UserService } from 'src/app/core/services/user.service';
import { UserProfile } from 'src/app/models/UserProfile';
import { ActivatedRoute } from '@angular/router';
import { Agreement } from '../models/agreement';
import { Observable, combineLatest, of } from 'rxjs';
import { switchMap, map, startWith } from 'rxjs/operators';
import { UIState } from 'src/app/core/constants/enums';


@Component({
    selector: 'app-nearby-item',
    templateUrl: './nearby-item.component.html',
    styleUrls: ['./nearby-item.component.scss', '../item-share/item-share.component.scss']
})
export class NearbyItemComponent implements OnInit {
    vm$: Observable<{ state: UIState, itemDetails?: DashboardItemDetails }>;
    userProfile: UserProfile;

    constructor(
        public route: ActivatedRoute,
        private itemDetailsQuery: ItemDetailsGQL,
        private userSvc: UserService,
    ) { }

    ngOnInit() {
        this.userProfile = this.userSvc.getCurrentUserProfile();
        this.vm$ = combineLatest([of(this.userProfile), this.route.params])
            .pipe(
                switchMap(([profile, params]) => {
                    return this.itemDetailsQuery
                        .watch({ userId: profile.id, itemId: params.id }).valueChanges
                        .pipe(
                            map(results => {
                                return {
                                    state: UIState.Done,
                                    itemDetails: results.data && results.data.itemDetails ?
                                        results.data.itemDetails :
                                        null
                                };
                            })
                        );
                }),
                startWith({ state: UIState.Loading, itemDetails: null })
            );
    }

    onConfirmMatch(item) {
        // TODO: implement after talking with Tony
        console.log('confirm called with item: ', item);
    }

    formatItemDetails(agreement: Agreement) {
        return `${agreement.quantity}${agreement.unitOfIssue ? ', ' + agreement.unitOfIssue : ''}${agreement.details ? ', ' + agreement.details : ''}`
    }
}
