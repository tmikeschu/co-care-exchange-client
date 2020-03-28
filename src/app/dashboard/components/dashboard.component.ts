import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { StatusDialogComponent } from './status-dialog/status-dialog.component';
import { Status } from './models/dasboard';
import { DashboardService } from 'src/app/services/cce/dashboard.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cce-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  hasNeeds: boolean= false;
  hasShares: boolean= false;
  requests: Status[];
  subscription: Subscription;
  
  constructor(public dialog: MatDialog, dashboardservice: DashboardService) { 

    //TODO: this will need to maybe update a store or some such, so that the rest of the app knows to update counts and details...
    this.subscription = dashboardservice.getRequests().subscribe(response => {
      console.log('response', response)
      if (response) {
        
        this.requests = response;
        this.setlabelstyles();
      }
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);   
  }

  setlabelstyles(){
    for(let x = 0; x < this.requests.length; x++){
      if(this.requests[x].statusTypeId == 1){
        this.hasNeeds = true;
      }

      if(this.requests[x].statusTypeId == 2){
        this.hasShares = true;
      }

      switch(this.requests[x].statusId){
        case 1:
        {
          this.requests[x].styleclass = 'contentstatusgreen';
          break;
        }
        case 2:
          {
            this.requests[x].styleclass = 'contentstatusgreen';
            break;
          }
        case 3:
          {
            this.requests[x].styleclass = 'contentstatusred';
            break;
          }
        case 4:
          {
            this.requests[x].styleclass = 'contentstatusyellow';
            break;
          }
        default:
            break;
      }
    } 
  }

  handleStatusClick(status: Status) {
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      width: '250px',
      data: status
    });

    dialogRef.afterClosed().subscribe(result => {
      //TODO: this will need to call serivce and update the item...
      console.log('The dialog was closed', result);      
      if(result){
        if(result.deny){
          this.requests.find(x => x.requestId === result.requestId).deny = result.confirm;
          this.requests.find(x => x.requestId === result.requestId).status = 'Cancelled';
          this.requests.find(x => x.requestId === result.requestId).statusId = 3;
          this.setlabelstyles();
        }

        if(result.confirm){
          this.requests.find(x => x.requestId === result.requestId).confirm = result.confirm;
          this.requests.find(x => x.requestId === result.requestId).status = 'Pickup Pending';
          this.requests.find(x => x.requestId === result.requestId).statusId = 4;
          this.setlabelstyles();
        }
      }

      console.log('updated', this.requests);
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}


