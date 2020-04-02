import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { Agreement } from '../models/agreement';

@Component({
  selector: 'app-status-dialog',
  templateUrl: 'status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss']
})
export class StatusDialogComponent {
  message: string;
  sharemessage: string = 'Are you able to pick up {0} from {1}?';
  needmessage: string = 'You matched as a sharer for {0} {1} of {2}.  Can you drop the items off at this location?  ';
  confirmmessage: string = 'Did you pickup {0} from {1}? ';
  okButtonText: string = 'OK';
  showNoButton: boolean = false;
  showMap: boolean = false;
  showCancelButton: boolean = false;

  constructor(public dialogRef: MatDialogRef<StatusDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Agreement) {
    console.log('StatusDialogComponent', data)
    this.message = data.dialogMessage;
    this.showMap = false;
    this.showNoButton = false;
    this.showCancelButton = false;

    if (data.statusTypeId == 1 && data.statusId == 2) {
      this.okButtonText = 'Ok';
      this.showNoButton = false;
    } else {
      this.okButtonText = 'OK';
    }

    if (data.statusTypeId == 2) {
      this.showMap = true;
      this.okButtonText = 'Yes';
    }

    if (data.statusTypeId == 1 && data.statusId < 2) {
      this.showCancelButton = true;
    }

    if (data.statusTypeId == 2 && data.statusId < 3) {
      this.showCancelButton = true;
    }
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  no() {
    this.dialogRef.close(false);
  }

  cancel() {
    this.dialogRef.close(false);
  }

}
