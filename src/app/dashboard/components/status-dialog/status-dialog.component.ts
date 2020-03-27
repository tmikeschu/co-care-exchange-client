import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'app-status-dialog',
    templateUrl: 'status-dialog.html',
  })
  export class StatusDialogComponent {
  
    constructor(
      public dialogRef: MatDialogRef<StatusDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Status) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }
  
  export interface Status {
    name: string;
    status: string;
  }