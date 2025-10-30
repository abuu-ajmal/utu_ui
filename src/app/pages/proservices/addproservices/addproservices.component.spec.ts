import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddproservicesComponent } from './addproservices.component';

describe('AddproservicesComponent', () => {
  let component: AddproservicesComponent;
  let fixture: ComponentFixture<AddproservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddproservicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddproservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
