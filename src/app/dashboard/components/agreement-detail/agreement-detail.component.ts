import { MatDialog } from '@angular/material';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

import { debounceTime, catchError, map, finalize, distinctUntilChanged, takeWhile } from 'rxjs/operators';
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
    // description$: Observable<String>;
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
         * For the pilot, sharers are deliverers - tony
         *
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
        this.agreement = this.dashboardService.agreementDetail;
        this.descriptionFC = new FormControl('');
        this.descriptionFC.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            takeWhile(() => this.isAlive)
        )
        .subscribe(description => {
            this.descriptionCurrentVal = description;
        });

        if (!this.agreement) {
            // TODO: should probably be handled better to be able to retrieve agreement item via url
            // instead of relying on accessing this view only from the dashboard
            this.router.navigate(['/dashboard']);
        }

        this.route.queryParams
            .subscribe(params => {
                this.agreementType = params.type;

                if (this.agreementType === 'share' && this.agreement.statusId === 1) {

                    const ref = this.dialog.open(ConfirmMatchDialogComponent, {
                        width: '300px',
                        data: this.agreement
                    });

                    ref.afterClosed().subscribe(results => {
                        if (results === 'Cancel') {
                            this.updateMatch(this.agreement, 4, 'Sharer refused the drop off terms.');
                        } else if (results === 'Confirm') {
                            this.updateMatch(this.agreement, 2, 'Sharer confirmed ability to drop off the items.');
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
            description: null
        };

        return this.dashboardService
            .updateOrderStatus(updateOrderStatusPayload)
            .pipe(
                map(data => {
                    if (data && data.errors && data.errors.length) {
                        const messages = data.errors.map(e => {
                            return `Message:  ${e.message} Path: ${e.path ? e.path[0] : null} `
                        }).join(', ');
                        throw new Error(messages);
                    }
                    return data;
                }),
                finalize(() => {
                    this.router.navigate(['/dashboard']);
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
                map(data => {
                    if (data && data.errors && data.errors.length) {
                        const messages = data.errors.map(e => e.message).join(', ');
                        throw new Error(messages);
                    }
                    return data;
                }),
                finalize(() => {
                    this.router.navigate(['/dashboard']);
                }),
                catchError((err) => {
                    this.toastrService.error(`Error: update description request for ${this.agreement.name} failed.`, null, {
                        enableHtml: true
                    });
                    return of([]);
                })
            )
            .subscribe();
    }

    onSubmitEdit() {
        const updateDescriptionPayload: OrderChangeInput = {
            orderId: this.agreement.orderId,
            userId: this.user.userProfile.id,
            newStatus: this.agreement.statusId,
            reason: 'Sharer updated item description',
            clientMutationId: '123456',
            requestId: this.agreement.requestId,
            shareId: this.agreement.shareId,
            description: this.descriptionCurrentVal
        };
        this.updateOrderDesc(updateDescriptionPayload);
    }
}
