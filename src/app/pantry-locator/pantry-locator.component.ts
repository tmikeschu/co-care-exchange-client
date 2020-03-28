import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SIGNIN_ROUTE } from '../core/constants/routes';

@Component({
  selector: 'app-pantry-locator',
  templateUrl: './pantry-locator.component.html',
  styleUrls: ['./pantry-locator.component.scss']
})
export class PantryLocatorComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  foodBanks = FOODBANKS;

  ngOnInit() {
  }
  //await this.router.navigate(['/', SIGNIN_ROUTE]);


  async back() {
    await this.router.navigate(['/', SIGNIN_ROUTE]);
  }

}

export interface FoodBank {
  name: string;
  address: string;
  notes: string
}

export const FOODBANKS: FoodBank[] = [
  {
    name: 'Hunger Free Colorado',
    address: '1355 S Colorado Blvd 201, Denver, CO 80222',
    notes: 'Accepts Donations'
  },
  {
    name: 'Food Bank of the Rockies',
    address: '3900 Nome St Warehouse, Denver, CO 80239',
    notes: 'Accepts Donations'
  },
  {
    name: 'Metro Caring',
    address: '1100 E 18th Ave, Denver, CO 80218',
    notes: 'Accepts Donations'
  }
]