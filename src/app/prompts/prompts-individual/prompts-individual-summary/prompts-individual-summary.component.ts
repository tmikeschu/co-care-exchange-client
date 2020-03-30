import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-prompts-individual-summary',
  templateUrl: './prompts-individual-summary.component.html',
  styleUrls: ['./prompts-individual-summary.component.scss']
})
export class PromptsIndividualSummaryComponent implements OnInit {

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
