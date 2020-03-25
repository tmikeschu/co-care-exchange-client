import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  registrantType: string;
  error = false;

  constructor() { }

  ngOnInit() {
    this.registrantType = 'Individual';
  }
}
