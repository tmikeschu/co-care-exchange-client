import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/cce/dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.scss']
})
export class SiteFooterComponent implements OnInit {
  messageCount: number = 0;
  subscription: Subscription;

  constructor(dashboardservice: DashboardService) {
    this.subscription = dashboardservice.getRequests().subscribe(response => {
      console.log('SiteFooterComponent', response)
      if (response) {
        for(let x = 0; x < response.length; x++){
          if(response[x].statusId == 2){
            this.messageCount++;
          }
        }
        
      }
    });
   }

  ngOnInit() {
    
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
