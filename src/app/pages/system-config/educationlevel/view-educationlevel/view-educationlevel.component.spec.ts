import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEducationlevelComponent } from './view-educationlevel.component';

describe('ViewEducationlevelComponent', () => {
  let component: ViewEducationlevelComponent;
  let fixture: ComponentFixture<ViewEducationlevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEducationlevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEducationlevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
