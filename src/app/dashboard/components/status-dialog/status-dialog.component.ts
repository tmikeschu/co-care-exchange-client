import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { Status } from '../models/dasboard';

@Component({
    selector: 'app-status-dialog',
    templateUrl: 'status-dialog.component.html',
    styleUrls: ['./status-dialog.component.scss']
  })
  export class StatusDialogComponent {
    message: string;
    sharemessage: string = 'Are you able to pick up {0} from {1}?';
    needmessage: string = 'You matched as a sharer for {0} {1} of {2}.  Can you drop the items off at this location?  ';
  
    constructor(public dialogRef: MatDialogRef<StatusDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Status) {
      this.data.confirm = null;
      this.data.deny = null;

      if(data.statusTypeId == 1){        
        this.message = this.sharemessage.replace('{0}', data.name).replace('{1}', data.sourceName);
      }

      if(data.statusTypeId == 2){
        this.message = this.needmessage.replace('{0}', data.quantity.toString()).replace('{1}', data.itemType).replace('{2}', data.name);
      }
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
  