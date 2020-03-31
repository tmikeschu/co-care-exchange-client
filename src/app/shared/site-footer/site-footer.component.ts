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

  constructor(dashboardService: DashboardService) {
    this.dashboardService = dashboardService;
    this.messageCount = this.dashboardService.messageCount;
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
