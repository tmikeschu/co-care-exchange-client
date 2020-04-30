import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemShareComponent } from './item-share.component';

describe('ItemShareComponent', () => {
  let component: ItemShareComponent;
  let fixture: ComponentFixture<ItemShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
