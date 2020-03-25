import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PantryLocatorComponent } from './pantry-locator.component';

describe('PantryLocatorComponent', () => {
  let component: PantryLocatorComponent;
  let fixture: ComponentFixture<PantryLocatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PantryLocatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PantryLocatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
