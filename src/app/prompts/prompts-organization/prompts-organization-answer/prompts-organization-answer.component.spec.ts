import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptsOrganizationAnswerComponent } from './prompts-organization-answer.component';

describe('PromptsOrganizationAnswerComponent', () => {
  let component: PromptsOrganizationAnswerComponent;
  let fixture: ComponentFixture<PromptsOrganizationAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptsOrganizationAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptsOrganizationAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
