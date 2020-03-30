import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptsOrganizationQuestionComponent } from './prompts-organization-question.component';

describe('PromptsOrganizationQuestionComponent', () => {
  let component: PromptsOrganizationQuestionComponent;
  let fixture: ComponentFixture<PromptsOrganizationQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptsOrganizationQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptsOrganizationQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
