import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prompts-organization-summary',
  templateUrl: './prompts-organization-summary.component.html',
  styleUrls: ['./prompts-organization-summary.component.scss']
})
export class PromptsOrganizationSummaryComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onConfirm() {    
    this.router.navigate(['/dashboard']);
  }
}
