import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfessionalComponent } from './add-professional.component';

describe('AddProfessionalComponent', () => {
  let component: AddProfessionalComponent;
  let fixture: ComponentFixture<AddProfessionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProfessionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProfessionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
