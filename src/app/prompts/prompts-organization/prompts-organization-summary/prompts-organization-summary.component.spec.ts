import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptsOrganizationSummaryComponent } from './prompts-organization-summary.component';

describe('PromptsOrganizationSummaryComponent', () => {
  let component: PromptsOrganizationSummaryComponent;
  let fixture: ComponentFixture<PromptsOrganizationSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptsOrganizationSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptsOrganizationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
