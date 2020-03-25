import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CceHomeComponent } from './cce-home.component';

describe('CceHomeComponent', () => {
  let component: CceHomeComponent;
  let fixture: ComponentFixture<CceHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CceHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CceHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
