import { MatDialog } from '@angular/material';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

import { debounceTime, catchError, map, finalize, distinctUntilChanged, takeWhile, tap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ConfirmMatchDialogComponent } from '../confirm-new-match/confirm-new-match.component';
import { DashboardService } from 'src/app/core/services/cce/dashboard.service';
import { UserService } from 'src/app/core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Agreement } from '../models/agreement';
import { OrderChangeInput } from 'src/app/models/cce/order-model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-agreement-detail',
    templateUrl: 'agreement-detail.component.html',
    styleUrls: ['./agreement-detail.component.scss']
})
export class AgreementDetailComponent implements OnInit, OnDestroy {
    @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;

    isAlive: boolean;

    editDescription = false;
    descriptionFC: FormControl;
    descriptionCurrentVal: String;

    user: any;
    agreement: Agreement;
    agreement$: Observable<Agreement>;
    agreementType: String;

    queryParams$: Observable<any>;

    constructor(
        private dialog: MatDialog,
        private userSerice: UserService,
        private dashboardService: DashboardService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
        private router: Router
    ) { }

    ngOnInit() {
        this.isAlive = true;
        /**
         * User is requesting
         * All statuses execpt (4) "cancelled", sharer should be able to view the detail and cancel the match
         * if status (4) "cancelled" you can view it only
         *
         * User is sharing
         * if status (1) "new match" you are prompted to confirm you can drop it off
         *  if yes, move forward to (2) "confirmed"
         *  if no, cancel the match (4)
         * All other statuses except "cancelled", the sharer can view details and cancel
         */
        this.user = this.userSerice.getCurrentUser();
        this.descriptionFC = new FormControl('');
        this.agreement$ = this.dashboardService.selectedAgreement.pipe(
            tap((agreement: any) => {
                if (agreement) {
                    const desc = agreement.description || '';
                    this.descriptionFC.patchValue(desc);
                }
                if (!agreement) {
                    this.router.navigate(['/dashboard']);
                }
            })
        );

        this.descriptionFC.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            takeWhile(() => this.isAlive)
        )
            .subscribe(description => {
                this.descriptionCurrentVal = description;
            });

        this.route.queryParams
            .pipe(
                withLatestFrom(this.agreement$),
                tap(([params, agreement]) => {
                    if (!agreement || !params) {
                        this.router.navigate(['/dashboard']);
                    }
                }),
            )
            .subscribe(([params, agreement]) => {
                this.agreementType = params.type;

                if (this.agreementType && this.agreementType === 'share' && agreement && agreement.statusId === 1) {

                    const ref = this.dialog.open(ConfirmMatchDialogComponent, {
                        width: '300px',
                        data: agreement
                    });

                    ref.afterClosed().subscribe(results => {
                        if (results === 'Cancel') {
                            this.updateMatch(agreement, 4, 'Sharer refused the drop off terms.');
                        } else if (results === 'Confirm') {
                            this.updateMatch(agreement, 2, 'Sharer confirmed ability to drop off the items.');
                        }
                    });

                }

            });
    }

    ngOnDestroy() {
        this.isAlive = false;
    }

    updateMatch(agreement, newStatusId, reason = 'Update status from agreement details') {
        // Pending (0) -> Matched (1) -> Confirmed (2) -> Fulfilled (3) -> Cancelled (4)
        const updateOrderStatusPayload: OrderChangeInput = {
            orderId: agreement.orderId,
            userId: this.user.userProfile.id,
            newStatus: newStatusId,
            reason,
            clientMutationId: '123456',
            requestId: agreement.requestId,
            shareId: agreement.shareId,
            description: agreement.description || this.descriptionCurrentVal || null
        };

        return this.dashboardService
            .updateOrderStatus(updateOrderStatusPayload)
            .pipe(
                map(data => {
                    if (data && data.errors && data.errors.length) {
                        const messages = data.errors.map(e => {
                            return `Message:  ${e.message} Path: ${e.path ? e.path[0] : null}`;
                        }).join(', ');
                        throw new Error(messages);
                    }
                    if (data && data.data && data.data.changeStatus && data.data.changeStatus.orderViewModel) {
                        const nextAgreement = data.data.changeStatus.orderViewModel;
                        if (nextAgreement) {
                            this.dashboardService.setSelectedAgreement(nextAgreement);
                        }
                    }
                    return data;
                }),
                catchError((err) => {
                    console.log('Agreement Detail updateOrderStatus error', err.message)
                    this.toastrService.error(`Error: updating the order for ${agreement.name} failed.`, null, {
                        enableHtml: true
                    });
                    return of([]);
                })
            )
            .subscribe();
    }

    onCancelMatch(agreement) {
        this.updateMatch(agreement, 4, 'User cancelled the match in agreement detail view.');
    }

    onConfirmDropOff(agreement) {
        this.updateMatch(agreement, 3, 'Sharer confirmed that they have dropped off the item.');
    }

    onCancelEdit() {
        this.editDescription = false;
        this.descriptionCurrentVal = '';
    }

    updateOrderDesc(payload: OrderChangeInput) {
        console.log('update order description payload: ', payload);
        this.dashboardService.updateOrderDescription(payload)
            .pipe(
                map((data: any) => {
                    if (data && data.errors && data.errors.length) {
                        const messages = data.errors.map(e => e.message).join(', ');
                        throw new Error(messages);
                    }

                    if (data && data.data && data.data.updateOrderDescription && data.data.updateOrderDescription.orderViewModel) {
                        const nextAgreement = data.data.updateOrderDescription.orderViewModel;
                        if (nextAgreement) {
                            this.dashboardService.setSelectedAgreement(nextAgreement);
                        }
                    }
                    return data;
                }),
                finalize(() => {
                    this.editDescription = false;
                }),
                catchError((err) => {
                    this.toastrService.error(`Error: update description request failed.`, null, {
                        enableHtml: true
                    });
                    return of([]);
                })
            )
            .subscribe();
    }

    onSubmitEdit(agreement) {
        const updateDescriptionPayload: OrderChangeInput = {
            orderId: agreement.orderId,
            userId: this.user.userProfile.id,
            newStatus: agreement.statusId,
            reason: 'Sharer updated item description',
            clientMutationId: '123456',
            requestId: agreement.requestId,
            shareId: agreement.shareId,
            description: this.descriptionCurrentVal
        };
        this.updateOrderDesc(updateDescriptionPayload);
    }
}
