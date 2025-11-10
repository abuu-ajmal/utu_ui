import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewfacilityservicesComponent } from './viewfacilityservices.component';

describe('ViewfacilityservicesComponent', () => {
  let component: ViewfacilityservicesComponent;
  let fixture: ComponentFixture<ViewfacilityservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewfacilityservicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewfacilityservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
