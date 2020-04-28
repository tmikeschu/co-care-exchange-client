import { MatDialog } from '@angular/material';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

import { debounceTime, catchError, map, finalize, distinctUntilChanged, takeWhile, tap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ConfirmMatchDialogComponent } from '../confirm-new-match/confirm-new-match.component';
import { DashboardService, IDashboardState } from 'src/app/core/services/cce/dashboard.service';
import { UserService } from 'src/app/core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Agreement } from '../models/agreement';
import { OrderChangeInput } from 'src/app/models/cce/order-model';
import { ToastrService } from 'ngx-toastr';
import { Status } from 'src/app/core/constants/enums';

@Component({
    selector: 'app-agreement-detail',
    templateUrl: 'agreement-detail.component.html',
    styleUrls: ['./agreement-detail.component.scss']
})
export class AgreementDetailComponent implements OnInit, OnDestroy {
    @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;

    isAlive: boolean;

    editSharerNote = false;
    sharerNoteFC: FormControl;
    sharerNoteCurrentVal: string;

    editRequesterNote = false;
    requesterNoteFC: FormControl;
    requesterNoteCurrentVal: string;

    status = Status;

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
        this.sharerNoteFC = new FormControl('');
        this.requesterNoteFC = new FormControl('');
        this.agreement$ = this.dashboardService.state$.pipe(
            map((data: IDashboardState) => data.activeAgreement),
            tap((agreement: Agreement) => {
                if (agreement) {
                    const sharerNotes = agreement.sharerNotes || '';
                    const requesterNotes = agreement.requesterNotes || '';
                    this.sharerNoteFC.patchValue(sharerNotes);
                    this.sharerNoteFC.patchValue(requesterNotes);
                }
                if (!agreement) {
                    this.router.navigate(['/dashboard']);
                }
            })
        );

        this.sharerNoteFC.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            takeWhile(() => this.isAlive)
        )
            .subscribe(description => {
                this.sharerNoteCurrentVal = description;
            });

        this.requesterNoteFC.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            takeWhile(() => this.isAlive)
        )
            .subscribe(description => {
                this.requesterNoteCurrentVal = description;
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

                if (this.agreementType && this.agreementType === 'share' && agreement && agreement.status === Status.NewMatchFound) {

                    const ref = this.dialog.open(ConfirmMatchDialogComponent, {
                        width: '300px',
                        data: agreement
                    });

                    ref.afterClosed().subscribe(results => {
                        if (results === 'Cancel') {
                            this.updateOrder(agreement, { status: Status.OrderCancelled, reason: 'Sharer refused the drop off terms.' });
                        } else if (results === 'Confirm') {
                            this.updateOrder(agreement, {
                                status: Status.DeliveryPending, reason: 'Sharer confirmed ability to drop off the items.'
                            });
                        }
                    });
                }
            });
    }

    ngOnDestroy() {
        this.isAlive = false;
    }

    updateOrder(agreement: Agreement, updates: Partial<OrderChangeInput>) {
        const updateOrderPayload = {
            orderId: agreement.orderId,
            userId: this.user.userProfile.id,
            status: updates.status || null,
            reason: updates.reason || 'Update status from agreement detail',
            clientMutationId: '123456',
            requestId: agreement.requestId,
            shareId: agreement.shareId,
            sharerNotes: updates.sharerNotes || agreement.sharerNotes || null,
            requesterNotes: updates.requesterNotes || agreement.requesterNotes || null
        };

        this.dashboardService.updateOrder(updateOrderPayload)
            .pipe(
                takeWhile(() => this.isAlive),
                map(data => {
                    if (data && data.updateOrder) {
                        const orderVm = data.updateOrder.orderViewModel;
                        if (orderVm) {
                            this.dashboardService.setSelectedAgreement(orderVm);
                        } else {
                            this.router.navigate(['/dashboard']);
                        }
                    }
                }),
                catchError((err) => {
                    console.log('Agreement Detail update order error while updating status', err.message);
                    this.toastrService.error(`Error: updating the order for ${agreement.name} failed.`, null, {
                        enableHtml: true
                    });
                    return of([]);
                }),
                finalize(() => {
                    this.editSharerNote = false;
                })
            )
            .subscribe();
    }

    onCancelMatch(agreement) {
        this.updateOrder(agreement, { status: Status.OrderCancelled, reason: 'User cancelled the match in agreement detail view.' });
    }

    onConfirmDropOff(agreement) {
        this.updateOrder(agreement, { status: Status.OrderFulfilled, reason: 'Sharer confirmed that they have dropped off the item.' });
    }

    onCancelEdit() {
        this.editSharerNote = false;
        this.sharerNoteCurrentVal = '';
        this.editRequesterNote = false;
        this.requesterNoteCurrentVal = '';
    }

    onSubmitEdit(agreement) {
        this.updateOrder(agreement, {
            sharerNotes: this.sharerNoteCurrentVal
            , requesterNotes: this.requesterNoteCurrentVal
            , reason: 'Update agreement notes'
        });
    }
}
