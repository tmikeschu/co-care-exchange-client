import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prompts-organization-summary',
  templateUrl: './prompts-organization-summary.component.html',
  styleUrls: ['./prompts-organization-summary.component.scss']
})
export class PromptsOrganizationSummaryComponent implements OnInit {
  requests = ['Meals', 'Diapers'];
  shares = ['Toilet Paper', 'Toothpaste'];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onContinue() {
    console.log('continue');
    this.router.navigate(['/ccehome']);
  }
}
