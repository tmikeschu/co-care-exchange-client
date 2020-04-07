import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject } from '@angular/core';

import { Agreement } from '../models/agreement';



@Component({
    selector: 'app-answer-detail',
    templateUrl: 'answer-detail.component.html',
    styleUrls: ['./answer-detail.component.scss']
})
export class AnswerDetailComponent {
    answer: Agreement = {
        agreementId: '1234',
        discriminator: 'test',
        deliveryCoordinates: {
            latitude: 30,
            longitude: 450
        },
        deliveryAddress: '980 Newton St, A',
        cancelledOn: null,
        cancelledBy: null,
        name: 'Milk',
        statusId: 1,
        statusText: 'Finding a Match',
        dialogMessage: 'heyo',
        statusTypeId: 1,
        shareId: '1234',
        requestId: '44950'
    };

    constructor() { }


    onCancelMatch() {
        console.log('cancel match called');
    }

    onReportIssue() {
        console.log('report an issue called');
    }


}
