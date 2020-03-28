import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { Status } from '../models/dasboard';

@Component({
    selector: 'app-status-dialog',
    templateUrl: 'status-dialog.component.html',
    styleUrls: ['./status-dialog.component.scss']
  })
  export class StatusDialogComponent {
  
    constructor(public dialogRef: MatDialogRef<StatusDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Status) {
      this.data.confirm = null;
      this.data.deny = null;
    }
  
    confirm(): void {
      this.data.confirm = true;
      this.dialogRef.close(this.data);
    }

    deny(){
      this.data.deny = true;
      this.dialogRef.close(this.data);
    }
  
  }
  