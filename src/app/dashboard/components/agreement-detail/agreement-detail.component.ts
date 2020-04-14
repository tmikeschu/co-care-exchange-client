import { MatDialog } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

import { debounceTime, catchError, map, tap, finalize, share } from 'rxjs/operators';
import { Observable, of, combineLatest } from 'rxjs';

import { ConfirmMatchDialogComponent } from '../confirm-new-match/confirm-new-match.component';
import { DashboardService } from 'src/app/core/services/cce/dashboard.service';
import { UserService } from 'src/app/core/services/user.service';
import { AuthenticationService } from 'src/app/core/services/cce/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Agreement } from '../models/agreement';
import { OrderStatusChangeModel } from 'src/app/models/cce/order-model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-agreement-detail',
    templateUrl: 'agreement-detail.component.html',
    styleUrls: ['./agreement-detail.component.scss']
})
export class AgreementDetailComponent implements OnInit {
    @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;

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
        /**
         * TODO:
         * [] Confirmation Pick-up button
         * - Sharers will only see confirmation button if they are delivering (how do we know this?),
         * - needs individuals will only see the confirmation if it is in the Pick-Up workflow. (what does pick up workflow mean?)
         */
        this.user = this.userSerice.getCurrentUser();
        this.agreement = this.dashboardService.agreementDetail;
        this.route.queryParams
            .subscribe(params => {
                this.agreementType = params.type;

                if (this.agreementType === 'need' && this.agreement.statusId === 0) {

                    const ref = this.dialog.open(ConfirmMatchDialogComponent, {
                        width: '300px',
                        data: this.agreement
                    });

                    ref.afterClosed().subscribe(results => {
                        // 'Cancel' || 'Confirm'
                        if (results === 'Cancel') {
                            this.onCancelMatch(this.agreement);
                        }
                    });

                }

            });
    }

    onCancelMatch(agreement) {
        const orderToCancel: OrderStatusChangeModel = {
            orderId: agreement.orderId,
            userId: this.user.userProfile.id,
            newStatus: 4, // cancel
            reason: 'No longer needed',
            clientMutationId: '123456',
            requestId: agreement.requestId,
            shareId: agreement.shareId,
        };

        this.dashboardService
            .updateOrderStatus(orderToCancel)
            .pipe(
                map(data => {
                    if (data && data.errors && data.errors.length) {
                        const messages = data.errors.map(e => e.message).join(', ');
                        throw new Error(messages);
                    }
                    return data;
                }),
                finalize(() => this.router.navigate(['/dashboard'])),
                catchError((err) => {
                    this.toastrService.error(`Error: order cancel request for ${agreement.name} failed.`, null, {
                        enableHtml: true
                    });
                    return of([]);
                })
            );
    }

    onConfirmPickup() {
        console.log('confirm pick up called');
    }

    // onCancelEdit() {
    //     this.editDescription = false;
    //     this.descriptionCurrentVal = '';
    // }

    // onSubmitEdit() {
    //     console.log('edit description submitted, go update the description with: ', this.descriptionCurrentVal);
    // }
}
