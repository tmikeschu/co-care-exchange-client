import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'app-confirm-new-match',
    templateUrl: './confirm-new-match.component.html',
    styleUrls: ['./confirm-new-match.component.scss']
})
export class ConfirmMatchDialogComponent {

    constructor(public dialogRef: MatDialogRef<ConfirmMatchDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    onCancelPickup() {
        console.log('cancel agreement clicked');
        this.dialogRef.close(this.data);
    }

    onConfirmPickup() {
        console.log('confirm pickup clicked');
        this.dialogRef.close(this.data);
    }

}
