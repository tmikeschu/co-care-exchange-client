import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pantry-locator',
  templateUrl: './pantry-locator.component.html',
  styleUrls: ['./pantry-locator.component.scss']
})
export class PantryLocatorComponent implements OnInit {

  constructor() { }
  // constructor(private elementRef: ElementRef) { }
  // constructor(private el: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
  }

  foodBanks = FOODBANKS;

  // ngAfterViewInit(){
  //   // this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'red';
  //   this.renderer.setElementStyle(this.el.nativeElement, 'background-color', '#5789D8');
  //   this.renderer.setElementStyle(this.el.nativeElement, 'color', '#FFFFFF');
  // }



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