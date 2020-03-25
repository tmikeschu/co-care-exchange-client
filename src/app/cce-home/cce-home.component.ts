import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-cce-home',
  templateUrl: './cce-home.component.html',
  styleUrls: ['./cce-home.component.scss']
})
export class CceHomeComponent implements OnInit {

  requests: Status[] = [{name: 'Meals', status: 'On its way!'}, {name: 'Diapers', status: 'New Match!'}];
  shares: Status[] = [{name: 'Toilet Paper', status: 'New Match!'}, {name: 'Toothpaste', status: 'New Match!'}];

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  handleStatusClick(status: Status) {
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      width: '250px',
      data: status
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // do something here.
    });
  }
}

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
