import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/cce/dashboard.service';
import { Subscription } from 'rxjs';
import { Agreement } from 'src/app/dashboard/components/models/agreement';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.scss']
})
export class SiteFooterComponent implements OnInit {
  messageCount: number = 0;
  subscription: Subscription;
  agreements: any;
  dashboardService: DashboardService;

  constructor(dashboardservice: DashboardService) {
     this.dashboardService = dashboardservice;
     this.messageCount = this.dashboardService.messageCount;
    // this.subscription = dashboardservice.getRequests().subscribe(response => {
    //   console.log('SiteFooterComponent', response)
    //   if (response) {
    //     this.agreements = response;
    //     for(let x = 0; x < this.agreements.length; x++){
    //       if(this.agreements[x].statusId == 2){
    //         this.messageCount++;
    //       }
    //     }
        
    //   }
    // });
   }

  ngOnInit() {
    
  }

  // updateCount(){
  //   console.log('updateCount - this.agreements', this.agreements);
  //   for(let x = 0; x < this.agreements.length; x++){
  //     if(this.agreements[x].statusId == 2){
  //       this.messageCount++;
  //     }
  //   }
  // }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    //this.subscription.unsubscribe();
  }

}
