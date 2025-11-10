import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfacilityservicesComponent } from './addfacilityservices.component';

describe('AddfacilityservicesComponent', () => {
  let component: AddfacilityservicesComponent;
  let fixture: ComponentFixture<AddfacilityservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddfacilityservicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddfacilityservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
