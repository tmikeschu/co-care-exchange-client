import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardItemDetails, CceSDK } from 'src/app/graphql/generatedSDK';
import { UserService } from 'src/app/core/services/user.service';
import { UserProfile } from 'src/app/models/UserProfile';
import { ActivatedRoute, Router } from '@angular/router';
import { Agreement } from '../models/agreement';
import { Observable, combineLatest, of, Subscription } from 'rxjs';
import { switchMap, map, startWith, catchError, finalize, tap } from 'rxjs/operators';
import { UIState } from 'src/app/core/constants/enums';
import { FormControl } from '@angular/forms';
import { handleGQLErrors } from 'src/app/graphql/utils/error-handler';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-nearby-item',
    templateUrl: './nearby-item.component.html',
    styleUrls: ['./nearby-item.component.scss', '../item-share/item-share.component.scss']
})
export class NearbyItemComponent implements OnInit, OnDestroy {
    vm$: Observable<{ state: UIState, itemDetails?: DashboardItemDetails, userId: string }>;
    userProfile: UserProfile;
    matchQty = new FormControl(0);
    matchSub: Subscription;

    constructor(
        public route: ActivatedRoute,
        private router: Router,
        private api: CceSDK,
        private toastrSvc: ToastrService,
        private userSvc: UserService,
    ) { }

    ngOnInit() {
        this.userProfile = this.userSvc.getCurrentUserProfile();
        this.vm$ = combineLatest([of(this.userProfile), this.route.params])
            .pipe(
                switchMap(([profile, params]) => {
                    return this.api.itemDetailsWatch({ userId: profile.id, itemId: params.id })
                        .valueChanges
                        .pipe(
                            map(results => {
                                return {
                                    state: UIState.Done,
                                    userId: profile.id,
                                    itemDetails: results.data && results.data.itemDetails ?
                                        results.data.itemDetails :
                                        null
                                };
                            })
                        );
                }),
                startWith({ state: UIState.Loading, itemDetails: null, userId: null })
            );
    }

    onConfirmMatch(item, userId, quantity) {
        this.matchSub = this.api.createMatch({
            input: {
                quantity,
                userId,
                clientMutationId: '12345',
                itemId: item.itemId
            }
        }).pipe(
            tap(d => console.log('data from create match: ', d)),
            catchError(e => {
                console.log('error: ', e);
                this.toastrSvc.error('An unexpected error has occurred creating the match. Please try again later.', null, {
                    positionClass: 'toast-top-center',
                });
                return of(null);
            }),
            finalize(() => {
                this.router.navigate(['/nearby-items']);
            })
        ).subscribe();
    }

    formatItemDetails(agreement: Agreement) {
        return `${agreement.quantity}${agreement.unitOfIssue ? ', ' + agreement.unitOfIssue : ''}${agreement.details ? ', ' + agreement.details : ''}`
    }

    ngOnDestroy() {
        this.matchSub.unsubscribe();
    }
}
