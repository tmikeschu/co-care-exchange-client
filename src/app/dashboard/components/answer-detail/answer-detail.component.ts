import { MatDialog } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-answer-detail',
    templateUrl: 'answer-detail.component.html',
    styleUrls: ['./answer-detail.component.scss']
})
export class AnswerDetailComponent implements OnInit {
    @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;

    editDescription = false;
    descriptionFC: FormControl;
    descriptionCurrentVal: String;

    userId = '1234';

    answer: any = {
        agreementId: '1234',
        discriminator: 'test',
        deliveryCoordinates: {
            latitude: 30,
            longitude: 450
        },
        deliveryAddress: '980 Newton St, A',
        description: 'testing description',
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

    constructor(private dialog: MatDialog) { }

    ngOnInit() {
        this.descriptionFC = new FormControl(this.answer.description);
        this.descriptionFC.valueChanges.pipe(debounceTime(400))
            .subscribe(desc => {
                this.descriptionCurrentVal = desc;
            });
    }

    onCancelEdit() {
        console.log('edit description cancelled. Revert value');
        this.editDescription = false;
        this.descriptionCurrentVal = '';
    }

    onSubmitEdit() {
        console.log('edit description submitted, go update the description with: ', this.descriptionCurrentVal);
    }

    onCancelMatch() {
        console.log('cancel match called');
    }

    onReportIssue() {
        console.log('report an issue called');
    }

    onConfirmPickup() {
        console.log('confirm pick up called');
    }


}
