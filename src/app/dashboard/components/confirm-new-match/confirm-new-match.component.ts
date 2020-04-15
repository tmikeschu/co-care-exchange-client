import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { Agreement } from '../models/agreement';

@Component({
    selector: 'app-confirm-new-match',
    templateUrl: './confirm-new-match.component.html',
    styleUrls: ['./confirm-new-match.component.scss']
})
export class ConfirmMatchDialogComponent {

    constructor(public dialogRef: MatDialogRef<ConfirmMatchDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Agreement) { }

    onCancelPickup() {
        this.dialogRef.close('Cancel');
    }

    onConfirmPickup() {
        this.dialogRef.close('Confirm');
    }

}
