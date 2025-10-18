import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEducationlevelComponent } from './add-educationlevel.component';

describe('AddEducationlevelComponent', () => {
  let component: AddEducationlevelComponent;
  let fixture: ComponentFixture<AddEducationlevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEducationlevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEducationlevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
