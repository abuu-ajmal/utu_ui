import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsetslotsComponent } from './addsetslots.component';

describe('AddsetslotsComponent', () => {
  let component: AddsetslotsComponent;
  let fixture: ComponentFixture<AddsetslotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddsetslotsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddsetslotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
