import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SIGNIN_ROUTE } from '../core/constants/routes';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pantry-locator',
  templateUrl: './pantry-locator.component.html',
  styleUrls: ['./pantry-locator.component.scss'],
})
export class PantryLocatorComponent implements OnInit {

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  foodBanks: FoodBank[] = FOODBANKS;
  selectedIndex: number = 0;
  selectedLocation = this.foodBanks[0].mapUrl

  ngOnInit() {
  }

  selectLocation(_index: number) {
    this.selectedIndex = _index;
  }

  getSelectedMapUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.foodBanks[this.selectedIndex].mapUrl)
  }

  async back() {
    await this.router.navigate(['/', SIGNIN_ROUTE]);
  }
}

export interface FoodBank {
  name: string;
  address: string;
  // latitude: string;
  // longitude: string;
  notes: string;
  mapUrl: string;
  selected: boolean;
};

export const FOODBANKS: FoodBank[] = [
  {
    name: 'Hunger Free Colorado',
    address: '1355 S Colorado Blvd 201, Denver, CO 80222',
    notes: 'Accepts Donations',
    // latitude: '39.692006',
    // longitude: '-104.9438724',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3070.1199916970204!2d-104.94387268378917!3d39.6920059794561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c867b4d6828f7%3A0x58f62d70fc55390f!2sHunger%20Free%20Colorado!5e0!3m2!1sen!2sus!4v1585531515749!5m2!1sen!2sus',
    selected: false
  },
  {
    name: 'Food Bank of the Rockies',
    address: '3900 Nome St Warehouse, Denver, CO 80239',
    notes: 'No Donations at location',
    // latitude: '39.7711104',
    // longitude: '-104.852211',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3066.5990236323128!2d-104.85221098378781!3d39.77111037944558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c7b495bfb9049%3A0x1299aced9da39e60!2sFood%20Bank%20of%20the%20Rockies%20-%20NO%20DONATIONS%20AT%20THIS%20LOCATION!5e0!3m2!1sen!2sus!4v1585531609884!5m2!1sen!2sus',
    selected: false
  },
  {
    name: 'Metro Caring',
    address: '1100 E 18th Ave, Denver, CO 80218',
    notes: 'Accepts Donations',
    // latitude: '39.7446569',
    // longitude: '-104.9751635',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.777130225283!2d-104.97516348378824!3d39.74465687944895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c79321b069e39%3A0xe11368dab2dbf586!2sMetro%20Caring!5e0!3m2!1sen!2sus!4v1585529408147!5m2!1sen!2sus',
    selected: false
  }
];
