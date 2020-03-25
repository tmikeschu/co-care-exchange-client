import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

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
