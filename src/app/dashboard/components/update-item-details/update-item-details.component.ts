import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { Agreement } from '../models/agreement';

@Component({
    selector: 'app-update-item-details.component',
    templateUrl: './update-item-details.component.html',
    styleUrls: ['./update-item-details.component.scss']
})
export class UpdateItemDetailsComponent {

    constructor(public dialogRef: MatDialogRef<UpdateItemDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: Agreement) { }

    onCancelEdit() {
        this.dialogRef.close('Cancel');
    }

    onSaveEdit() {
        this.dialogRef.close('Confirm');
    }

    handleQuantity(direction) {
        switch (direction) {
          case 'up':
            this.data.quantity += 1;
            break;
          case 'down':
            this.data.quantity > 0 ? this.data.quantity -= 1 : 0;
            break;
          default:
            break;
        }
      }

}
