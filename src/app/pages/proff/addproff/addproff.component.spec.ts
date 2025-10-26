import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddproffComponent } from './addproff.component';

describe('AddproffComponent', () => {
  let component: AddproffComponent;
  let fixture: ComponentFixture<AddproffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddproffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddproffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
