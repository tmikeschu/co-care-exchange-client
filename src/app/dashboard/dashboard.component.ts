import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { StatusDialogComponent, Status } from './status-dialog/status-dialog.component';

@Component({
  selector: 'app-cce-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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


